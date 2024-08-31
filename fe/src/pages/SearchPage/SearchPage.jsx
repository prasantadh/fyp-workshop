import React, { useEffect, useState } from "react";
import CustomInput from "../../components/Input";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getUsers } from "../../utils/Users";
import UserBox from "../../components/UserBox";
import toast from "react-hot-toast";
import { authenticAxiosInstance, getCurrentUserId } from "../../utils/axios";
import { checkForInvalidOrExpiredToken } from "../../utils/jwt_decode";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [searchParams] = useSearchParams();

  const [filteredUser, setFilteredUsers] = useState([]);
  const [users, setUsers] = useState([]);

  const [follows, setFollows] = useState([]);
  const navigate = useNavigate();

  // Debounce the search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    const getUserFromLocal = async () => {
      const data = JSON.parse(localStorage.getItem("users"));

      if (!data) {
        const user = await getUsers();
        if (user) {
          setUsers(user);
          setFilteredUsers(users);
        } else {
          navigate("/login");
        }
      } else {
        setUsers(data);
        setFilteredUsers(data);
      }
    };
    getUserFromLocal();
  }, [navigate]);

  useEffect(() => {
    if (debouncedQuery) {
      navigate(`?q=${debouncedQuery}`);
    }
  }, [debouncedQuery, navigate]);

  const handleOnchange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const query = searchParams.get("q");
    setSearchQuery(query ?? "");
  }, [navigate]);

  useEffect(() => {
    if (searchQuery !== "") {
      toast.error("K va");
      const filteredData = users.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filteredData);
    } else {
      if (users && users.length > 0) {
        console.log("K cha ", users);
        setFilteredUsers(users);
      }
    }
  }, [searchQuery]);

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
      });
  }, []);

  return (
    <div>
      <div>
        <CustomInput value={searchQuery} onChange={handleOnchange} />
      </div>
      {filteredUser.length > 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {filteredUser.map((item) => {
            return getCurrentUserId("tokenFromServer") === item.id ? (
              <></>
            ) : (
              <UserBox user={item} followerList={follows} />
            );
          })}
        </div>
      ) : (
        <div>No user found</div>
      )}
    </div>
  );
};

export default SearchPage;
