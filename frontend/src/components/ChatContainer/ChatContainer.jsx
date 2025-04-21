import React, { useEffect, useState } from "react";
import classes from "./ChatContainer.module.css";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Card from "../Card/Card";
import { io } from "socket.io-client";
import { useRef } from "react";
import { CiImageOn } from "react-icons/ci";
import Modal from "../Modal/Modal";

const ChatContainer = ({ selectedUser, onBack, onlineUsers }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const token = Cookies.get("jwt");
  const user = jwtDecode(token);
  const messageRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const readUnreadedMessages = async () => {
    const response = await fetch("/api/update-unread-messages", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ senderId: selectedUser._id, read: true }),
    });

    if (response.ok) {
      const updated = await response.json();
      console.log("Updated messages:", updated);
    } else {
      console.error("Failed to mark messages as read");
    }
  };

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
      readUnreadedMessages();
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    try {
      const res = await fetch(`/api/send/${selectedUser._id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Cookies.get("jwt")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, image: imagePreview }),
      });
      if (res.ok) {
        setText("");
        handleMessages();
        setImagePreview("");

        if (fileInputRef.current) fileInputRef.current.value = "";
      }
      readUnreadedMessages();
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
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
      readUnreadedMessages();
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
    messageRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
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
      <div style={{ margin: "0", borderBottom: "1px solid black" }}>
        <Card
          fullName={selectedUser.fullName}
          img={selectedUser.profilePicture}
          isOnline={onlineUsers.includes(selectedUser._id)}
          style={{ margin: "0" }}
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
              {message.image && (
                <img
                  src={message.image}
                  className={classes.sentImage}
                  onClick={() => setSelectedImage(message.image)}
                  alt="Sent"
                />
              )}
              <p className={classes.messageText}>{message.text}</p>
            </div>
          );
        })}

        {imagePreview && <img src={imagePreview} />}
      </div>

      <div className={classes.sendMessageContainer}>
        <textarea
          placeholder="Type your message..."
          rows={1}
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
        <label htmlFor="sendImage">
          <CiImageOn className={classes.sendImage} />
        </label>
        <input
          type="file"
          accept="image/*"
          name="sendImage"
          id="sendImage"
          ref={fileInputRef}
          onChange={handleImageChange}
          className={classes.sendImageInput}
        />

        <button
          onClick={handleSendMessage}
          disabled={!text.trim() && !imagePreview}
        >
          Send
        </button>
      </div>
      {selectedImage && (
        <Modal closeModal={() => setSelectedImage(null)}>
          <img
            src={selectedImage}
            alt="Full view"
            className={classes.modalImage}
          />
        </Modal>
      )}
    </div>
  );
};

export default ChatContainer;
