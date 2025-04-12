import React from "react";
import classes from "./StartChat.module.css";
import { LuMessageSquare } from "react-icons/lu";

const StartChat = () => {
  return (
    <div className={classes.startChat}>
      <LuMessageSquare className={classes.chattingLogo} />
      <h3>Start Chatting</h3>
    </div>
  );
};

export default StartChat;
