import { useEffect, useRef, useState } from "react";
import Modal from "../Modal";
import { checkForInvalidOrExpiredToken } from "../../utils/jwt_decode";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { authenticAxiosInstance } from "../../utils/axios";
import CustomInput from "../Input";
import WriteIcon from "../icons/WriteIcon";
import style from "./singlepost.module.css";
import { format } from "date-fns";

const formatDate = (dateString) => {
  // Parse the string to a Date object and format it
  const date = new Date(dateString);
  return format(date, "yyyy-MM-dd");
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

const SinglePost = ({ user, tweet, currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const modalRef = useRef(null); // Ref for modal

  console.log(console.log("Given ", user));

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
        <Link
          className={`${style.singleCircularProfile}`}
          style={{
            textDecoration: "none",
          }}
          to={"/profile/" + user.id}
        >
          {user && user.username && user.username.slice(0, 1).toUpperCase()}
        </Link>
        <div className={style.postRightContainer}>
          <div className={style.singlePostHeaderContainer}>
            <div className={style.singlePostHeader}>
              <h2>{user.username}</h2>
              <p>{formatDate(tweet.created_at)}</p>
            </div>
            {currentUser && (
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
            )}
          </div>
          <p>{tweet.content}</p>
        </div>
      </div>
    </>
  );
};

export default SinglePost;
