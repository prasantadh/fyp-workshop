import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { authenticAxiosInstance, getCookie } from "../../utils/axios";
import {
  checkForInvalidOrExpiredToken,
  decodeJWT,
  deleteCookie,
} from "../../utils/jwt_decode";

import style from "./profile.module.css";
import CustomButton from "../../components/Button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const EditProfilePage = () => {
  const [user, setUser] = useState();
  const [followers, setFollowers] = useState(null);

  const navigate = useNavigate();

  console.log("Request Headers:", authenticAxiosInstance.defaults.headers);

  useEffect(() => {
    const token = getCookie("tokenFromServer");

    try {
      if (token) {
        console.log("Token ", token);
        const data = decodeJWT(token);
        console.log("Token ", data);
        console.log(data.sub);
        console.log(data.csrf);
        console.log("Token ", data.fresh);

        authenticAxiosInstance
          .get("/users/" + data.sub)
          .then(function (response) {
            console.log(response);
            if (response.data) {
              if (response.data.status === "failure") {
                toast.error(response.data.data);
                // setIncorrectData(response.data.data);
              } else {
                toast.success("User " + response.data.status);
                console.log(response.data.data);

                setUser(response.data.data);
              }
            } else {
              toast.error("Something Went Wrong.");
            }
          })
          .catch(function (error) {
            console.log("User error ", error);

            toast.error("Something Went Wrong.");
          });

        authenticAxiosInstance
          .get("/followers")
          .then(function (response) {
            console.log(response);
            if (response.data) {
              if (response.data.status === "failure") {
                toast.error(response.data.data);
              } else {
                toast.success("Followers: " + response.data.status);
                console.log(response.data.data);
                setFollowers(response.data.data);
              }
            } else {
              toast.error("Followers: Something Went Wrong.");
            }
          })
          .catch(function (error) {
            if (error.response) {
              console.log(error.response.data);

              let invalid = checkForInvalidOrExpiredToken(
                error.response.data.msg
              );

              if (invalid) {
                navigate("/login");
                toast.error("You need to login");
              } else {
                console.log("Error 0", error.response.data);
              }
            }
          });
      } else {
        //TODO
      }
    } catch (err) {
      toast.error("Error in token");
      deleteCookie("tokenFromServer");
    }
  }, []);

  return (
    <>
      <div className={`${style.main}`}>
        {user && (
          <div className={`${style.user_info}`}>
            <div className={`${style.frame_19}`}>
              <h3>{user.username}</h3>
              {followers ? (
                <h2> {followers.length} followers</h2>
              ) : (
                <h2>....</h2>
              )}
              <CustomButton
                isRounded={true}
                text={"Edit Profile"}
                style={{
                  width: "40%",
                }}
              />
            </div>
            <div className={`${style.frame_19_2}`}>
              <div className={`${style.circularProfile}`}>
                {user.username.slice(0, 1).toUpperCase()}
              </div>
            </div>
          </div>
        )}
        <h2>Haha</h2>
      </div>
    </>
  );
};

export default EditProfilePage;
