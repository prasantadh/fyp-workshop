import React, { useEffect, useState } from "react";
import { Outlet, Router, useNavigate } from "react-router-dom";
import { getCookie } from "../utils/axios";

export const AuthRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const token = getCookie("tokenFromServer");
    if (token) {
      navigate("/");
    }

    setLoading(false);
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};
