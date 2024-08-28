import React, { useState } from "react";
import CustomButton, { ButtonType } from "../../components/Button";
import "./RegisterPage.css";
import CustomInput from "../../components/Input";
import { guestInstance } from "../../utils/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const RegisterComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [incorrectData, setIncorrectData] = useState(null);

  const navigate = useNavigate();

  const onUsernameChange = (event) => {
    console.log(event.target.value);
    setUsername(event.target.value);
    setIncorrectData(null);
  };

  const onPasswordChange = (event) => {
    console.log(event.target.value);
    setPassword(event.target.value);
    setIncorrectData(null);
  };

  const onHandelSubmit = () => {
    if (password.trim().length < 8) {
      toast.error("Password needs to be greater than 8 in length");
      return;
    }

    guestInstance
      .put("/users", {
        username,
        password,
      })
      .then(function (response) {
        console.log(response);
        if (response.data) {
          if (response.data.status === "failure") {
            toast.error(response.data.data);
            setIncorrectData(response.data.data);
          } else {
            toast.success(response.data.status);
          }
        } else {
          toast.error("Something Went Wrong.");
        }
      })
      .catch(function (error) {
        console.log(error);

        toast.error("Something Went Wrong.");
      });
  };

  return (
    <>
      <div className="main-container">
        
        <div className="left-container">
          <h1>FYP</h1>
          <div className="label-container">
            <label htmlFor="username"><b>USERNAME</b> </label><br/>
            <CustomInput
              hint={"username"}
              value={username}
              onChange={onUsernameChange}
              style={{height: "36px", width:"460px", margin: "24px"}}
            />
          </div>
          {incorrectData && (
            <p
              style={{
                color: "red",
                fontSize: "var(--text)",
                fontWeight: 600,
              }}
            >
              {incorrectData}
            </p>
          )}

          <div
            className="label-container"
            // style={{
            //   marginTop: "20px",
            // }}
          >
            <label htmlFor="password"><b>PASSWORD</b> </label>
            <br/>
            <CustomInput
              isPassword={true}
              hint={"password"}
              value={password}
              onChange={onPasswordChange}
              style={{height: "36px", width:"460px", margin: "24px"}}
            />
          </div>
          {incorrectData && (
            <p
              style={{
                color: "var(--error)",
                fontSize: "var(--text)",
                fontWeight: 600,
              }}
            >
              {incorrectData}
            </p>
          )}

          <div className="button-wrapper">
            <CustomButton
              text={"Sign Up"}
              buttonType={ButtonType.PRIMARY}
              isRounded
              onClick={onHandelSubmit}
              style={{height:"64px", width: "320px"}}
            />
          </div>
        </div>
        <div className="right-container">
        <div className="left-button-container">
            <h2>
              Start Your Journey!
            </h2>
            <br/>
            <span>Get Started now!</span>

            <p>Already have an account?</p>
            <div className="button-wrapper">
              <CustomButton
                className="test"
                isRounded
                text={"Sign In"}
                buttonType={ButtonType.SECONDARY}
                onClick={() => {
                  navigate("/login");
                }}
              />
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
};

const RegisterPage = () => {
  return (
    <>
      <RegisterComponent />
    </>
  );
};

export default RegisterPage;
