import React from "react";
import "./input.css";

const CustomInput = ({ hint, onChange, value, isPassword, style }) => {
  return (
    <input
      type={isPassword ? "password": "text"}
      onChange={onChange}
      placeholder={hint ?? "No Hints figure it out"}
      value={value}
      className="input"
      style = {style}
    />
  );
};

export default CustomInput;
