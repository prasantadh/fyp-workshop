import React, { useEffect, useRef, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import {
  authenticAxiosInstance,
  getCookie,
  getCurrentUserId,
} from "../../utils/axios";
import {
  checkForInvalidOrExpiredToken,
  decodeJWT,
  deleteCookie,
} from "../../utils/jwt_decode";
import { format, parseISO } from "date-fns";

import style from "./profile.module.css";
import CustomButton from "../../components/Button";
import toast from "react-hot-toast";
import { json, Link, useNavigate } from "react-router-dom";
import WriteIcon from "../../components/icons/WriteIcon";
import Modal from "../../components/Modal";
import CustomInput from "../../components/Input";
import { getUsers } from "../../utils/Users";
import UserBox from "../../components/UserBox";
import SinglePost from "../../components/SinglePost";

const DeleteModal = ({ onClose }) => {
  const navigate = useNavigate();
  const deleteAccountAPI = () =>
    authenticAxiosInstance
      .delete(`/users`)
      .then(function (response) {
        console.log(response);
        if (response.data) {
          if (response.data.status === "failure") {
            toast.error(response.data.data);
          } else {
            toast.success("User Deleted: " + response.data.status);
            console.log("User Deleted", response.data.data);
            deleteCookie("tokenFromServer");
            window.location.reload();
            onClose();
          }
        } else {
          toast.error("User Deleted: Something Went Wrong.");
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
      <h2>Would you like to delete your account?</h2>
      <div>
        <button
          onClick={() => {
            deleteAccountAPI();
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

const EditProfileModal = ({ onCancel, user }) => {
  const [userName, setuserName] = useState(user.username);
  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false);

  const navigate = useNavigate();

  const onUpdateUsername = () => {
    //TODO
    // Incomplete in backend
    toast.error("No implementation in backend");
    // authenticAxiosInstance
    //   .patch("/users", {
    //     username: userName,
    //   })
    //   .then(function (response) {
    //     console.log(response);
    //     if (response.data) {
    //       if (response.data.status === "failure") {
    //         toast.error(response.data.data);
    //       } else {
    //         toast.success("Changed: " + response.data.status);
    //         console.log(response.data.data);
    //       }
    //     } else {
    //       toast.error("Followers: Something Went Wrong.");
    //     }
    //   })
    //   .catch(function (error) {
    //     if (error.response) {
    //       console.log(error.response.data);

    //       let invalid = checkForInvalidOrExpiredToken(error.response.data.msg);

    //       if (invalid) {
    //         navigate("/login");
    //         toast.error("You need to login");
    //       } else {
    //         console.log("Error 0", error.response.data);
    //       }
    //     }
    //   });
  };

  return (
    <>
      <Modal
        isOpen={openDeleteConfirmBox}
        onClose={() => {
          setOpenDeleteConfirmBox(false);
        }}
        children={
          <DeleteModal
            onClose={() => {
              setOpenDeleteConfirmBox(false);
            }}
          />
        }
      />
      <div>
        <h2>Username</h2>
        <CustomInput
          value={userName}
          onChange={(e) => {
            setuserName(e.target.value);
          }}
        />

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
        <div
          style={{
            display: "flex",
          }}
        >
          <button
            onClick={() => {
              onCancel();
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onUpdateUsername();
            }}
          >
            Update
          </button>
        </div>
      </div>
    </>
  );
};

const EditProfilePage = () => {
  const [user, setUser] = useState();
  const [followers, setFollowers] = useState(null);
  const [tweets, setTweets] = useState(null);
  const [isOpenFollowerModal, setIsOpenFollowerModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const currentId = getCurrentUserId("tokenFromServer");

    try {
      if (currentId) {
        authenticAxiosInstance
          .get("/users/" + currentId)
          .then(function (response) {
            console.log(response);
            if (response.data) {
              if (response.data.status === "failure") {
                toast.error(response.data.data);
              } else {
                toast.success("User " + response.data.status);
                console.log("Getting user ", response.data.data);

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
          .get(`/users/${currentId}/tweets`)
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

  const FollowerModal = ({ onCancel }) => {
    const navigate = useNavigate();
    const [follows, setFollows] = useState([]);

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
    }, []);

    return (
      <Tabs>
        <TabList>
          <Tab>Followers {followers ? followers.length : "0"}</Tab>
          <Tab>Following {follows ? follows.length : "0"}</Tab>
        </TabList>

        <TabPanel>
          {followers &&
            followers.map((item) => {
              console.log("Followes?? ", item);

              return (
                <UserBox
                  user={item}
                  followerList={follows}
                  isFollowed={false}
                />
              );
            })}
        </TabPanel>
        <TabPanel>
          {follows &&
            follows.map((item) => {
              console.log("Followes?? ", item);

              return (
                <UserBox user={item} followerList={[]} isFollowed={true} />
              );
            })}
        </TabPanel>
      </Tabs>
    );
  };

  return (
    <>
      <Modal
        isOpen={isOpenFollowerModal}
        onClose={() => {
          setIsOpenFollowerModal(false);
        }}
        children={
          <FollowerModal
            onCancel={() => {
              setIsOpenFollowerModal(false);
            }}
          />
        }
      />

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
        }}
        children={
          <EditProfileModal
            onCancel={() => {
              setIsEditModalOpen(false);
            }}
            user={user}
          />
        }
      />

      <div className={`${style.main}`}>
        {user && (
          <div className={`${style.user_info}`}>
            <div className={`${style.frame_19}`}>
              <h3>{user.username}</h3>
              {followers ? (
                <h2
                  onClick={() => {
                    setIsOpenFollowerModal(true);
                  }}
                >
                  {" "}
                  {followers.length} followers
                </h2>
              ) : (
                <h2>....</h2>
              )}
              <CustomButton
                isRounded={true}
                text={"Edit Profile"}
                style={{
                  width: "40%",
                }}
                onClick={() => {
                  setIsEditModalOpen(true);
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
              return <SinglePost user={user} tweet={item} currentUser />;
            })}
        </div>
      </div>
    </>
  );
};

export default EditProfilePage;
