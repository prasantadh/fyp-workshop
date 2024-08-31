import React, { useEffect, useState } from "react";
import { authenticAxiosInstance, getCurrentUserId } from "../../utils/axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { getUsers } from "../../utils/Users";
import style from "./userprofile.module.css";
import CustomButton from "../../components/Button";
import SinglePost from "../../components/SinglePost";

const UserProfilePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tweets, setTweets] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const params = useParams();
  const { id } = useParams();
  console.log(params.id);

  const navigate = useNavigate();

  if (getCurrentUserId("tokenFromServer") === Number(params.id)) {
    navigate("/profile");
  }

  // Function to fetch tweets from a user
  const fetchTweets = async () => {
    try {
      setIsLoading(true);
      const response = await authenticAxiosInstance.get(
        `/users/${params.id}/tweets`
      );
      console.log(response.data.data);

      if (response.data.status === "failure") {
        toast.error(response.data.data);
        setTweets([]);
      } else {
        const data = response.data.data;
        setTweets(data);
      }
    } catch (error) {
      console.error("Error fetching tweets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserFromLocal = async () => {
    const data = JSON.parse(localStorage.getItem("users"));
    let userFound = [];
    if (!data) {
      const users = await getUsers();
      if (users) {
        userFound = users;
      } else {
        navigate("/login");
      }
    } else {
      userFound = data;
    }

    let currentUser = userFound.find((user) => user.id === Number(params.id));
    if (!currentUser) {
      toast.error("No Such User Found");
    }

    setCurrentUser(currentUser);
  };

  useEffect(() => {
    getUserFromLocal();
    fetchTweets();
  }, [params.id]);

  return (
    <div className={`${style.main}`}>
      {currentUser && (
        <div className={`${style.user_info}`}>
          <div className={`${style.frame_19}`}>
            <h3>{currentUser.username}</h3>
            {/* <CustomButton
              isRounded={true}
              text={"Edit Profile"}
              style={{
                width: "40%",
              }}
            /> */}
          </div>
          <div className={`${style.frame_19_2}`}>
            <div className={`${style.circularProfile}`}>
              {currentUser.username.slice(0, 1).toUpperCase()}
            </div>
          </div>
        </div>
      )}
      <div
        style={{
          width: "100%",
          background: "green",
        }}
      >
        {currentUser &&
          tweets &&
          tweets.map((item) => {
            return <SinglePost user={currentUser} tweet={item} />;
          })}
      </div>
    </div>
  );
};

export default UserProfilePage;
