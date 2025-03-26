import React, { useEffect, useState } from "react";
import classes from "./ChatContainer.module.css";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const ChatContainer = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const token = Cookies.get("jwt");
  const user = jwtDecode(token);

  const handleMessages = async () => {
    const res = await fetch(`/api/${selectedUser._id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      console.log(data);
      setMessages(data);
    }
  };

  useEffect(() => {
    handleMessages();
  }, [selectedUser._id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/send/${selectedUser._id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Cookies.get("jwt")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        console.log(text);
        setText("");
        handleMessages();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={classes.chatContainer}>
      {messages.map((message) => {
        const formattedDate = new Date(message.createdAt).toLocaleDateString(
          "mk-MK",
          {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }
        );
        const formattedTime = new Date(message.createdAt).toLocaleTimeString(
          "mk-MK",
          {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false, // Ensures 24-hour format
          }
        );
        return (
          <div
            key={message._id}
            style={
              message.senderId === user.id
                ? { textAlign: "right" }
                : { textAlign: "left" }
            }
          >
            <time>
              {formattedDate} {formattedTime}
            </time>
            <p>{message.text}</p>
          </div>
        );
      })}

      <div>
        <input
          type="text"
          name="text"
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ width: "70%", height: "25px", marginTop: "25px" }}
        />
        <button
          style={{ width: "25%", height: "25px", marginLeft: "20px" }}
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatContainer;
