import React from "react";
import classes from "./AuthHero.module.css";
import { LuMessageSquare } from "react-icons/lu";
import { useLocation } from "react-router-dom";

const AuthHero = () => {
  const location = useLocation();

  let title;
  let description;
  if (location.pathname === "/signup") {
    title = "Create Account";
    description = "Get started with your free account";
  } else if (location.pathname === "/login") {
    title = "Welcome Back";
    description = "Sign in to access your account";
  } else if (location.pathname === "/forgot-password") {
    title = "Forgot Your Password?";
    description = "Enter your email to get new password";
  }

  return (
    <div className={classes.authHero}>
      <div className={classes.iconContainer}>
        <LuMessageSquare className={classes.authHeroIcon} />
      </div>
      <h3 className={classes.title}>{title}</h3>
      <p className={classes.description}>{description}</p>
    </div>
  );
};

export default AuthHero;
