import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { FaFigma } from "react-icons/fa";
import SignInPage from "./pages/SignInPage";
import { Toaster, resolveValue } from "react-hot-toast";
import RegisterPage from "./pages/RegisterPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthRoute } from "./components/AuthRoute";
import EditProfilePage from "./pages/EditProfilePage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import SearchPage from "./pages/SearchPage/SearchPage";
import HomePage from "./pages/HomePage";
import UserProfilePage from "./pages/ProfilePage/UserProfilePage";

const root = ReactDOM.createRoot(document.getElementById("root"));

const router = createBrowserRouter([
  {
    path: "/register",
    element: (
      <AuthRoute>
        <RegisterPage />
      </AuthRoute>
    ),
  },
  {
    path: "/login",
    element: <AuthRoute children={<SignInPage />} />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
      {
        path: "/profile",
        element: <EditProfilePage />,
      },
      {
        path: "/profile/:id",
        element: <UserProfilePage />,
      },
    ],
  },
]);

root.render(
  <>
    <RouterProvider router={router} />

    <a
      href="https://www.figma.com/design/zw7AudlJriu5feL7YHJnE9/FYP-Workshop?node-id=0-1&t=K1i3FrgubB52EQDO-0"
      target="_blank"
      rel="noreferrer"
      style={{
        position: "absolute",
        right: "0.6rem",
        top: "45vh",
        background: "red",
        padding: "8px 10px",
        borderRadius: "50px",
      }}
    >
      <FaFigma color="white" />
    </a>
    <Toaster
      position="bottom-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
    />
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
