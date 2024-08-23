import { Outlet } from "react-router-dom";
import "./App.css";
import NavBar from "./components/Navbar/NavBar";
import { useState } from "react";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

function App() {
  const [test, setTest] = useState();

  useEffect(() => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcyNDIyODczOCwianRpIjoiZDA1NjMwMWEtNzBlMC00ZWIwLTk2NzQtMWNkOTEwNGQyODA0IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MiwibmJmIjoxNzI0MjI4NzM4LCJjc3JmIjoiYmM0ZWRlMmMtMDk5YS00OTI1LTk3ZmMtNjRjNDE0YzdlY2RmIiwiZXhwIjoxNzI0MjI5NjM4fQ.U_zlzAjcCIlv8GZVFAEdjRJoFXcsuljor6XOxU_FDXk";
    const decoded = jwtDecode(token);
    console.log(decoded);

    setTest(decoded);
  }, []);

  return (
    <div>
      <NavBar />
      <Outlet />
    </div>
  );
}

export default App;
