import React, { useEffect, useState } from "react";
import { Outlet, Router, useNavigate } from "react-router-dom";

export const AuthRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    let cookies = document.cookie;

    if (cookies.search("tokenFromServer") !== -1) {
      let availableCookies = cookies.split(";");

      availableCookies.forEach((element) => {
        if (element.trim().startsWith("tokenFromServer")) {
          const token = element.split("=")[1];
          console.log("Token found:", token);

          // Redirect after setting state
          navigate("/");
        }
      });
    }

    setLoading(false);
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};
