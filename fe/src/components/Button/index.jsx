import React from "react";
import "./button.css";

export const ButtonType = {
  PRIMARY: "button-primary",
  SECONDARY: "",
  EXTRA: "button-extra",
};

const CustomButton = ({
  buttonType = ButtonType.SECONDARY_GRADIENT,
  isRounded,
  disabled,
  text,
}) => {
  return (
    <button
      className={`button ${buttonType} ${isRounded ? "rounded" : ""}`}
      disabled={disabled}
    >
      {text ?? "default"}
    </button>
  );
};

export default CustomButton;
