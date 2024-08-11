import React from "react";
import CustomButton, { ButtonType } from "../../components/Button";
import "./SignInPage.css";
import CustomInput from "../../components/Input";

const SignInComponent = () => {
  return (
    <div className="main-container">
      <div className="left-container">
        <div className="left-button-container">
          <h2>
            Hey There! <br />
            Good to see you ...
          </h2>

          <p>Don't have an account?</p>
          <CustomButton
            isRounded
            text={"Sign Up"}
            buttonType={ButtonType.SECONDARY}
            style={{
              width: "60%",
            }}
          />
        </div>
      </div>
      <div className="right-container">
        <div className="label-container">
          <label for="username">Username: </label>
          <CustomInput hint={"Enter your Username"} />
        </div>

        <div className="label-container">
          <label for="password">Password: </label>
          <CustomInput hint={"Enter your password"} />
        </div>

        <CustomButton
          style={{
            width: "35%",
          }}
          text={"Login"}
          buttonType={ButtonType.PRIMARY}
          isRounded
        />
      </div>
    </div>
  );
};

const SignInPage = () => {
  return (
    <>
      <SignInComponent />
    </>
  );
};

export default SignInPage;
