import React from "react";
import classes from "./Card.module.css";

const Card = ({ img, fullName, onClick, isOnline }) => {
  return (
    <div className={classes.card} onClick={onClick}>
      <div className={classes.profileImageContainer}>
        <img src={img || "#"} alt="" />
        {isOnline ? (
          <div className={classes.online}></div>
        ) : (
          <div className={classes.offline}></div>
        )}
      </div>
      <div className={classes.profileInfoContainer}>
        <p>{fullName}</p>
        {isOnline ? "Online" : "Offline"}
      </div>
    </div>
  );
};

export default Card;
