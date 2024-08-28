import { Outlet } from "react-router-dom";
import "./App.css";
import NavBar from "./components/Navbar/NavBar";
import { useState } from "react";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

function App() {
  return (
    <div>
      <NavBar />
      <Outlet />
    </div>
  );
}

export default App;
