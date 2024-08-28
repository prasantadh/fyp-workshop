import React, { useEffect, useRef, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { authenticAxiosInstance, getCookie } from "../../utils/axios";
import {
  checkForInvalidOrExpiredToken,
  decodeJWT,
  deleteCookie,
} from "../../utils/jwt_decode";
import { format, parseISO } from "date-fns";

import style from "./profile.module.css";
import CustomButton from "../../components/Button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import WriteIcon from "../../components/icons/WriteIcon";
import Modal from "../../components/Modal";
import CustomInput from "../../components/Input";

const formatDate = (dateString) => {
  // Parse the string to a Date object and format it
  const date = new Date(dateString);
  return format(date, "yyyy-MM-dd");
};

const EditProfilePage = () => {
  const [user, setUser] = useState();
  const [followers, setFollowers] = useState(null);
  const [tweets, setTweets] = useState(null);

  const navigate = useNavigate();

  // console.log("Request Headers:", authenticAxiosInstance.defaults.headers);

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

        // for tweets
        authenticAxiosInstance
          .get(`/users/${data.sub}/tweets`)
          .then(function (response) {
            console.log(response);
            if (response.data) {
              if (response.data.status === "failure") {
                toast.error(response.data.data);
              } else {
                toast.success("Tweets: " + response.data.status);
                console.log("Tweets", response.data.data);
                setTweets(response.data.data);
              }
            } else {
              toast.error("Tweets: Something Went Wrong.");
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
  }, [navigate]);

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
        <div
          style={{
            width: "100%",
            background: "green",
          }}
        >
          {user &&
            tweets &&
            tweets.map((item) => {
              return <SinglePost user={user} tweet={item} />;
            })}
        </div>
      </div>
    </>
  );
};

const DeleteModal = ({ id, onClose }) => {
  const navigate = useNavigate();
  const deleteTweetAPI = () =>
    authenticAxiosInstance
      .delete(`/tweets/${id}`)
      .then(function (response) {
        console.log(response);
        if (response.data) {
          if (response.data.status === "failure") {
            toast.error(response.data.data);
          } else {
            toast.success("Tweets: " + response.data.status);
            console.log("Tweets", response.data.data);
            window.location.reload();
            onClose();
          }
        } else {
          toast.error("Tweets: Something Went Wrong.");
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

  return (
    <div>
      <h2>Would you like to delete?</h2>
      <div>
        <button
          onClick={() => {
            deleteTweetAPI();
          }}
        >
          Yes
        </button>
        <button
          onClick={() => {
            onClose();
          }}
        >
          No
        </button>
      </div>
    </div>
  );
};

const UpdateModal = ({ tweet, onCancel }) => {
  const [content, setContent] = useState(tweet.content ? tweet.content : "");

  const navigate = useNavigate();

  const updateModalAPI = () =>
    authenticAxiosInstance
      .patch(`/tweets/${tweet.id}`, {
        content,
      })
      .then(function (response) {
        console.log(response);
        if (response.data) {
          if (response.data.status === "failure") {
            toast.error(response.data.data);
          } else {
            toast.success("Tweets: " + response.data.status);
            console.log("Tweets", response.data.data);
            window.location.reload();
            onCancel();
          }
        } else {
          toast.error("Tweets: Something Went Wrong.");
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

  return (
    <div>
      <CustomInput
        value={content}
        hint={"Enter Content"}
        onChange={(e) => {
          setContent(e.target.value);
        }}
      />
      <button
        onClick={() => {
          updateModalAPI();
        }}
      >
        Update
      </button>
      <button
        onClick={() => {
          onCancel();
        }}
      >
        Cancel
      </button>
    </div>
  );
};

const SinglePost = ({ user, tweet }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const modalRef = useRef(null); // Ref for modal

  // Function to handle click outside the modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false); // Close the modal if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <Modal
        isOpen={openDeleteConfirmBox}
        onClose={() => {
          setOpenDeleteConfirmBox(false);
        }}
        children={
          <DeleteModal
            id={tweet.id}
            onClose={() => {
              setOpenDeleteConfirmBox(false);
            }}
          />
        }
      />

      <Modal
        isOpen={openUpdateModal}
        onClose={() => {
          setOpenUpdateModal(false);
        }}
        children={
          <UpdateModal
            tweet={tweet}
            onCancel={() => {
              setOpenUpdateModal(false);
            }}
          />
        }
      />

      <div className={`${style.singlePost}`}>
        <div className={`${style.singleCircularProfile}`}>
          {user.username.slice(0, 1).toUpperCase()}
        </div>
        <div className={style.postRightContainer}>
          <div className={style.singlePostHeaderContainer}>
            <div className={style.singlePostHeader}>
              <h2>{openDeleteConfirmBox ? "Yes" : "No"}</h2>
              <p>{formatDate(tweet.created_at)}</p>
            </div>
            <div className={style.dropdown}>
              <div
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                <WriteIcon />
              </div>
              {isOpen && (
                <div className={style.modal} ref={modalRef}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setOpenUpdateModal(true);
                    }}
                  >
                    Update <WriteIcon />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setOpenDeleteConfirmBox(true);
                    }}
                  >
                    Delete <WriteIcon />
                  </div>
                </div>
              )}
            </div>
          </div>
          <p>{tweet.content}</p>
        </div>
      </div>
    </>
  );
};

export default EditProfilePage;
