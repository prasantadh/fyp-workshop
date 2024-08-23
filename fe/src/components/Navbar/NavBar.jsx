import React from "react";
import "./NavBar.css"; // Add your CSS file for styling
import { GrHomeRounded } from "react-icons/gr";
import { FaPen, FaUser } from "react-icons/fa";

const NavBar = () => {
  return (
    <section className="navbar">
      <div className="logo">
        <h1>FYP</h1>
      </div>
      <div className="nav-content">
        <div className="nav-title">ICP-Twitter-Hub</div>
        <nav className="nav-buttons">
          <a href="/home" className="nav-button">
            <GrHomeRounded />
          </a>
          <a href="/write-tweet" className="nav-button">
            <FaPen />
          </a>
          <a href="/profile" className="nav-button">
            <FaUser />
          </a>
        </nav>
      </div>
    </section>
  );
};

export default NavBar;
