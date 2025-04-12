import React, { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";

import { Link, useLocation } from "react-router-dom";
import classes from "./PasswordInput.module.css";

const PasswordInput = ({ onChange, value, label, name }) => {
  const [visiblePassword, setVisiblePassword] = useState(false);
  const location = useLocation().pathname;
  return (
    <div className={classes.passwordInputContainer}>
      <label htmlFor={name}>{label}</label>
      <div className={classes.inputContainer}>
        <input
          type={visiblePassword ? "text" : "password"}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
        />
        {!visiblePassword ? (
          <FaRegEyeSlash
            className={classes.passwordInputIcon}
            onClick={() => {
              setVisiblePassword((prevData) => !prevData);
            }}
          />
        ) : (
          <FaRegEye
            className={classes.passwordInputIcon}
            onClick={() => {
              setVisiblePassword((prevData) => !prevData);
            }}
          />
        )}
      </div>

      {location === "/login" && (
        <Link
          to="/forgot-password"
          style={{
            textDecoration: "none",
            color: "#8ab2a6",
            textAlign: "right",
          }}
        >
          Forgot Password
        </Link>
      )}
    </div>
  );
};

export default PasswordInput;
