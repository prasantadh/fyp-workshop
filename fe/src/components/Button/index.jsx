import React from "react";
import "./button.css";

export const ButtonType = {
  PRIMARY: "button-primary",
  SECONDARY: "",
  SECONDARY_GRADIENT: "button-gradient-secondary",
};

const CustomButton = ({
  buttonType = ButtonType.SECONDARY_GRADIENT,
  isRounded,
  text,
}) => {
  return (
    <button className={`button ${buttonType} ${isRounded ? "rounded" : ""}`}>
      {text ?? "default"}
    </button>
  );
};

export default CustomButton;
