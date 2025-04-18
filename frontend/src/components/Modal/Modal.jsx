import React from "react";
import classes from "./Modal.module.css";

const Modal = ({ children, closeModal }) => {
  return (
    <div className={classes.modal} onClick={() => closeModal()}>
      <p className={classes.closeModal} onClick={() => closeModal()}>
        X
      </p>
      {children}
    </div>
  );
};

export default Modal;
