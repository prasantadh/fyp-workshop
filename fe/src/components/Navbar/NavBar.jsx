import React from "react";
import "./NavBar.css"; // Add your CSS file for styling

import FeedIcon from "../icons/FeedIcon";
import SearchIcon from "../icons/SearchIcon";
import WriteIcon from "../icons/WriteIcon";
import ProfileIcon from "../icons/ProfileIcon";
import { Link } from "react-router-dom";
import LogoutIcon from "../icons/LogoutIcon";

const NavBar = () => {
  return (
    <section className="navbar">
      <div className="logo">
        <h1>FYP</h1>
      </div>
      <div className="nav-content">
        <div className="nav-title">ICP - Twitter - Hub</div>
        <nav className="nav-buttons">
          <a className="nav-button">
            <Link to="/">
                <FeedIcon />
            </Link>
          </a>
          <a className="nav-button">
            <Link to="/search">
              <SearchIcon />
            </Link>
          </a>
          <a className="nav-button"> 
            {/* we create a modal for writing */}
            <Link to="/write-tweet">
              <WriteIcon />
            </Link>
          </a>
          <a className="nav-button">
            <Link to="/profile">
              <ProfileIcon />
            </Link>
          </a>
          <a className="nav-button">
            <Link to="/logOut">
              <LogoutIcon/>
            </Link>
          </a>
        </nav>
      </div>
    </section>
  );
};

export default NavBar;
