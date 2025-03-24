import React from "react";
import classes from "./Card.module.css"
import img from "../../assets/react.svg"

const Card = ()=>{
    return <div className={classes.card}>
<div className={classes.profileImageContainer}>
    <img src={img} alt="" />
</div>
<div className={classes.profileInfoContainer}>
<p>Sasko Stevkovski</p>
<p>Online</p>
</div>
    </div>
}

export default Card