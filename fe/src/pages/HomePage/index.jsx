import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authenticAxiosInstance } from "../../utils/axios";
import toast from "react-hot-toast";
import { checkForInvalidOrExpiredToken } from "../../utils/jwt_decode";

import { getUsers } from "../../utils/Users";
import SinglePost from "../../components/SinglePost";

const HomePage = () => {
  const navigate = useNavigate();
  const [follows, setFollows] = useState([]);
  const [isLoadiong, setIsLoadiong] = useState(true);
  const [users, setUsers] = useState([]);

  const [feeds, setFeeds] = useState([]);
  const observerRef = useRef();

  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [tweetsFetched, setTweetsFetched] = useState(0);

  // Function to fetch tweets from a user
  const fetchTweets = async (userId) => {
    try {
      setIsLoadiong(true);
      const response = await authenticAxiosInstance.get(
        `/users/${userId}/tweets`
      );
      console.log(response.data.data);

      if (response.data.status === "failure") {
        toast.error(response.data.data);
        return [];
      }

      const data = response.data.data;
      return data;
    } catch (error) {
      console.error("Error fetching tweets:", error);
      return [];
    } finally {
      setIsLoadiong(false);
    }
  };

  // Function to load more tweets
  const loadTweets = async () => {
    console.log(follows);
    console.log(currentUserIndex);

    if (currentUserIndex >= follows.length) {
      console.log("no more users");

      return;
    }

    const currentUser = follows[currentUserIndex];
    const tweets = await fetchTweets(currentUser.id);

    console.log("current tweets");

    if (tweets.length > 0) {
      // Add tweets to the feed
      setFeeds((prevFeed) => [...prevFeed, ...tweets]);
      setTweetsFetched((prevCount) => prevCount + tweets.length);
    }

    setCurrentUserIndex((prevIndex) => prevIndex + 1);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isLoadiong) {
        loadTweets();
      }
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [isLoadiong, currentUserIndex, tweetsFetched]);

  // Initial load when component mounts
  useEffect(() => {
    loadTweets();
  }, [follows]);

  useEffect(() => {
    authenticAxiosInstance
      .get("/follows")
      .then(function (response) {
        console.log(response);
        if (response.data) {
          if (response.data.status === "failure") {
            toast.error(response.data.data);
          } else {
            toast.success("Followers: " + response.data.status);
            console.log(response.data.data);
            setFollows(response.data.data);
          }
        } else {
          toast.error("Followers: Something Went Wrong.");
        }
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);

          let invalid = checkForInvalidOrExpiredToken(error.response.data.msg);

          if (invalid) {
            navigate("/login");
            toast.error("You need to login");
          } else {
            console.log("Error 0", error.response.data);
          }
        }
      })
      .finally(() => {
        setIsLoadiong(false);
      });
  }, []);

  useEffect(() => {
    const getUserFromLocal = async () => {
      const data = JSON.parse(localStorage.getItem("users"));

      if (!data) {
        const user = await getUsers();
        if (user) {
          setUsers(user);
        } else {
          navigate("/login");
        }
      } else {
        setUsers(data);
      }
    };
    getUserFromLocal();
  }, [navigate]);

  return follows.length < 1 ? (
    <div>
      You are not following anyone please.
      <Link to="/search"> Go to search</Link>
    </div>
  ) : (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {users &&
        feeds.map((item, index) => {
          let currentUser = users.find((user) => user.id === item.user_id);

          return <SinglePost tweet={item} user={currentUser} />;
        })}
      {isLoadiong && (
        <p>{feeds.length > 0 ? "Loading more tweets..." : "Loading tweets"}</p>
      )}
      <div ref={observerRef} style={{ height: "50px" }} />{" "}
      {/* Sentinel element */}
    </div>
  );
};

export default HomePage;
