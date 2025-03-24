import React from "react";
import classes from "./Sidebar.module.css"

const Sidebar = ({children}) => {
    return <div className={classes.sidebar}>{children}</div>
}

export default Sidebar