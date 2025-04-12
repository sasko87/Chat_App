import React from "react";
import classes from "./AlertMessage.module.css";

const AlertMessage = ({ children }) => {
  return <div className={classes.alertMessage}>{children}</div>;
};

export default AlertMessage;
