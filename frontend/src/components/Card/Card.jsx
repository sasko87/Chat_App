import React from "react";
import classes from "./Card.module.css";

const Card = ({
  img,
  fullName,
  onClick,
  isOnline,
  notifications,
  ...props
}) => {
  return (
    <div className={classes.card} onClick={onClick} {...props}>
      <div className={classes.profileImageContainer}>
        <img
          src={img || "https://cdn-icons-png.flaticon.com/512/6596/6596121.png"}
          alt=""
        />
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
