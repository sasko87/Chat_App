import React from "react";
import classes from "./Form.module.css"

const Form = ({children}) =>  {
    return <form className={classes.form}>{children}</form>
}

export default Form