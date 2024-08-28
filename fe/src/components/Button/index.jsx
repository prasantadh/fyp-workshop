import React from "react";
import "./button.css";

export const ButtonType = {
  PRIMARY: "button-primary",
  SECONDARY: "",
  EXTRA: "button-extra",
};

const CustomButton = ({
  buttonType = ButtonType.SECONDARY,
  isRounded,
  disabled,
  text,
  onClick,
  style,
}) => {
  return (
    <button
      onClick={onClick}
      className={`button ${buttonType} ${isRounded ? "rounded" : ""}`}
      style={style}
      disabled={disabled}
    >
      {text ?? "default"}
    </button>
  );
};

export default CustomButton;
