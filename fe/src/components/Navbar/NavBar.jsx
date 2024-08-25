import React from "react";
import "./NavBar.css"; // Add your CSS file for styling

import FeedIcon from "../icons/FeedIcon";
import SearchIcon from "../icons/SearchIcon";
import WriteIcon from "../icons/WriteIcon";
import ProfileIcon from "../icons/ProfileIcon";

const NavBar = () => {
  return (
    <section className="navbar">
      <div className="logo">
        <h1>FYP</h1>
      </div>
      <div className="nav-content">
        <div className="nav-title">ICP - Twitter - Hub</div>
        <nav className="nav-buttons">
          <a href="/home" className="nav-button">
            <FeedIcon/>
          </a>
          <a href="/write-tweet" className="nav-button">
            <SearchIcon/>
          </a>
          <a href="/write-tweet" className="nav-button">
            <WriteIcon/>
          </a>
          <a href="/profile" className="nav-button">
            <ProfileIcon/>
          </a>
        </nav>
      </div>
    </section>
  );
};

export default NavBar;
