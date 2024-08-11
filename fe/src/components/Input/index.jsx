import React from "react";
import "./input.css";

const CustomInput = ({ hint, onChange, value }) => {
  return (
    <input
      onChange={onChange}
      placeholder={hint ?? "No Hints figure it out"}
      value={value}
      className="input"
    />
  );
};

export default CustomInput;
