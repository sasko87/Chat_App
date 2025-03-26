import React from "react";
import classes from "./Card.module.css"


const Card = ({img, fullName, onClick})=>{
    return <div className={classes.card} onClick={onClick}>
<div className={classes.profileImageContainer}>
    <img src={img} alt="" />
</div>
<div className={classes.profileInfoContainer}>
<p>{fullName}</p>
<p>Online</p>
</div>
    </div>
}

export default Card