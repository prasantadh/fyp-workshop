import React from 'react';
import { FaHome, FaPen, FaUser } from 'react-icons/fa'; // Import icons from React Icons
import './Navbar.css'; // Add your CSS file for styling

const NavBar = () => {
  return (
    <header className="navbar">
      <div className="logo">
        <h1>FYP</h1>
        <div className="nav-title">ICP-Twitter-Hub</div>
      </div>
      <nav className="nav-buttons">
        <a href="/home" className="nav-button">
          <FaHome />
        </a>
        <a href="/write-tweet" className="nav-button">
          <FaPen />
        </a>
        <a href="/profile" className="nav-button">
          <FaUser />
        </a>
      </nav>
    </header>
  );
};

export default NavBar;
