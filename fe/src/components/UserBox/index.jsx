import React, { useEffect, useState } from "react";
import style from "./user.module.css";
import CustomButton from "../Button";
import { Link, useNavigate } from "react-router-dom";
import { authenticAxiosInstance } from "../../utils/axios";
import toast from "react-hot-toast";
import { checkForInvalidOrExpiredToken } from "../../utils/jwt_decode";

const UserBox = ({ user, followerList, isFollowed }) => {
  const navigate = useNavigate();

  const isAlreadyFollowing = followerList.some(
    (follow) => follow.id === user.id
  );

  const unFollow = (id) => {
    authenticAxiosInstance
      .delete("/follows/" + id)
      .then(function (response) {
        console.log(response);
        if (response.data) {
          if (response.data.status === "failure") {
            toast.error(response.data.data);
          } else {
            toast.success("Unfollow: " + response.data.status);
            console.log(response.data.data);
            window.location.reload();
          }
        } else {
          toast.error("Unfollow: Something Went Wrong.");
        }
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);

          let invalid = checkForInvalidOrExpiredToken(error.response.data.msg);

          if (invalid) {
            navigate("/login");
            toast.error("You need to login");
            window.location.reload();
          } else {
            console.log("Error 0", error.response.data);
            toast.error("Unfollow: Something Went Wrong.");
          }
        }
      });
  };

  const follow = (id) => {
    authenticAxiosInstance
      .put("/follows/" + id)
      .then(function (response) {
        console.log(response);
        if (response.data) {
          if (response.data.status === "failure") {
            toast.error(response.data.data);
          } else {
            toast.success("Follow: " + response.data.status);
            console.log(response.data.data);
            window.location.reload();
          }
        } else {
          toast.error("Follow: Something Went Wrong.");
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
  };

  return (
    <div className={style.flex}>
      <Link to={"/profile/" + user.id} className={`${style.circularProfile}`}>
        {user.username.slice(0, 1).toUpperCase()}
      </Link>
      <h2>{user.username}</h2>
      {isFollowed || isAlreadyFollowing ? (
        <CustomButton
          text={"Unfollow"}
          onClick={() => {
            unFollow(user.id);
          }}
        />
      ) : (
        <CustomButton
          text={"Follow"}
          onClick={() => {
            follow(user.id);
          }}
        />
      )}
    </div>
  );
};

export default UserBox;
