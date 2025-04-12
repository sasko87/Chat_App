import React from "react";
import classes from "./WelcomeContainer.module.css";
import { TiMessages } from "react-icons/ti";
import { TbMessage2Dollar } from "react-icons/tb";
import { RiAccountCircleLine } from "react-icons/ri";
import { MdOutlineAccountBox } from "react-icons/md";
import { MdOutlineSwitchAccount } from "react-icons/md";
import { LuSend } from "react-icons/lu";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { FaSpellCheck } from "react-icons/fa6";
import { TbMessages } from "react-icons/tb";
import { useLocation } from "react-router-dom";

const WelcomeContainer = () => {
  const location = useLocation().pathname;
  return (
    <div className={classes.welcomeContainer}>
      <div className={classes.gridContainer}>
        <div className={classes.square}>
          <TiMessages className={classes.welcomeIcon} />
        </div>
        <div className={classes.square}>
          <RiAccountCircleLine className={classes.welcomeIcon} />
        </div>
        <div className={classes.square}>
          <TbMessage2Dollar className={classes.welcomeIcon} />
        </div>
        <div className={classes.square}>
          <MdOutlineSwitchAccount className={classes.welcomeIcon} />
        </div>
        <div className={classes.square}>
          <LuSend className={classes.welcomeIcon} />
        </div>
        <div className={classes.square}>
          <IoCheckmarkDoneSharp className={classes.welcomeIcon} />
        </div>
        <div className={classes.square}>
          <FaSpellCheck className={classes.welcomeIcon} />
        </div>
        <div className={classes.square}>
          <TbMessages className={classes.welcomeIcon} />
        </div>
        <div className={classes.square}>
          <MdOutlineAccountBox className={classes.welcomeIcon} />
        </div>
      </div>
      <div className={classes.textContainer}>
        <h3>{location === "/login" ? "Welcome Back" : "Create Account"}</h3>
        <p>
          {location === "/login"
            ? "Sign in to continue your conversations and text your friends"
            : "Create your free account and start chatting with people"}
        </p>
      </div>
    </div>
  );
};

export default WelcomeContainer;
