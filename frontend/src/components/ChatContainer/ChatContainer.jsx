import React, { useEffect, useState } from "react";
import classes from "./ChatContainer.module.css";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Card from "../Card/Card";
import { io } from "socket.io-client";
import { useRef } from "react";

const ChatContainer = ({ selectedUser, onBack, onlineUsers }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const token = Cookies.get("jwt");
  const user = jwtDecode(token);
  const messageRef = useRef(null);

  const handleMessages = async () => {
    const res = await fetch(`/api/user/${selectedUser._id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      setMessages(data);
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
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
        setText("");
        handleMessages();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const subscribeToMessages = () => {
    if (!selectedUser) return;
    const socket = io(
      "http://localhost:3000",

      {
        query: {
          userId: user.id,
        },
      }
    );
    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
  };

  const unsubscribeFromMessages = () => {
    const socket = io(
      "http://localhost:3000",

      {
        query: {
          userId: user.id,
        },
      }
    );
    socket.off("newMessage");
  };

  useEffect(() => {
    handleMessages();
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id]);

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div className={classes.chatContainer}>
      {window.innerWidth < 470 && (
        <button
          onClick={() => onBack()} // or use a prop callback to clear selectedUser
          className={classes.backButton}
        >
          ← Back
        </button>
      )}
      <div>
        <Card
          fullName={selectedUser.fullName}
          img={selectedUser.profilePicture}
          isOnline={onlineUsers.includes(selectedUser._id)}
        />
      </div>
      <div className={classes.messageContainer}>
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
              className={
                message.senderId === user.id
                  ? classes.senderMessage
                  : classes.receiverMessage
              }
              title={`${formattedDate} ${formattedTime}`} // Tooltip on hover
              ref={messageRef}
            >
              {/* <time>
              {formattedDate} {formattedTime}
            </time> */}
              <p>{message.text}</p>
            </div>
          );
        })}
      </div>

      <div className={classes.sendMessageContainer}>
        <input
          type="text"
          name="text"
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && text.trim() !== "") {
              handleSendMessage(e);
            }
          }}
        />
        <button
          onClick={handleSendMessage}
          disabled={text === "" ? true : false}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatContainer;
