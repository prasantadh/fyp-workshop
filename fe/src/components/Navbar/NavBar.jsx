import React, { useState } from "react";
import "./NavBar.css"; // Add your CSS file for styling

import FeedIcon from "../icons/FeedIcon";
import SearchIcon from "../icons/SearchIcon";
import WriteIcon from "../icons/WriteIcon";
import ProfileIcon from "../icons/ProfileIcon";
import { Link, useNavigate } from "react-router-dom";
import LogoutIcon from "../icons/LogoutIcon";
import {
  checkForInvalidOrExpiredToken,
  deleteCookie,
} from "../../utils/jwt_decode";
import Modal from "../Modal";
import { authenticAxiosInstance } from "../../utils/axios";
import toast from "react-hot-toast";
import CustomInput from "../Input";

const NavBar = () => {
  const [isAddTweetOpen, setIsAddTweetOpen] = useState(false);

  const AddTweetModal = ({ onClose }) => {
    const [content, setContent] = useState("");
    const navigate = useNavigate();

    const addTweetAPI = () =>
      authenticAxiosInstance
        .put(`/tweets`, {
          content: content,
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
              onClose();
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

    return (
      <div>
        <CustomInput
          value={content}
          hint={"Enter Content"}
          onChange={(e) => {
            setContent(e.target.value);
          }}
        />
        <div>
          <button
            onClick={() => {
              addTweetAPI();
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

  return (
    <section className="navbar">
      <Modal
        isOpen={isAddTweetOpen}
        onClose={() => {
          setIsAddTweetOpen(false);
        }}
        children={
          <AddTweetModal
            onClose={() => {
              setIsAddTweetOpen(false);
            }}
          />
        }
      />

      <div className="logo">
        <h1>FYP</h1>
      </div>
      <div className="nav-content">
        <div className="nav-title">ICP - Twitter - Hub</div>
        <nav className="nav-buttons">
          <Link className="nav-button" to="/">
            <FeedIcon />
          </Link>

          <Link className="nav-button" to="/search">
            <SearchIcon />
          </Link>

          {/* we create a modal for writing */}
          <div
            onClick={() => {
              setIsAddTweetOpen(true);
            }}
          >
            <WriteIcon />
          </div>

          <Link className="nav-button" to="/profile">
            <ProfileIcon />
          </Link>

          <div
            onClick={() => {
              deleteCookie("tokenFromServer");
              window.location.reload();
            }}
            className="nav-button"
          >
            <LogoutIcon />
          </div>
        </nav>
      </div>
    </section>
  );
};

export default NavBar;
