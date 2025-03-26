import React from "react";
import classes from "./Form.module.css"

const Form = ({children, onSubmit}) =>  {
    return <form className={classes.form} onSubmit={onSubmit}>{children}</form>
}

export default Form