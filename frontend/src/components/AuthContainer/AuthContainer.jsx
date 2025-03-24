import React from "react";
import classes from "./AuthContainer.module.css"

const AuthContainer = ({children}) =>{
    return <div className={classes.authContainer}>{children}</div>
}

export default AuthContainer