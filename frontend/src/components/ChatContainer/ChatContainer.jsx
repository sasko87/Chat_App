import React from "react";
import classes from "./ChatContainer.module.css"

const ChatContainer = ({children}) => {
    return <div className={classes.chatContainer}>{children}</div>
}

export default ChatContainer