import React, { useEffect, useState } from "react";
import AuthContainer from "../components/AuthContainer/AuthContainer";
import Card from "../components/Card/Card";
import Sidebar from "../components/Sidebar/Sidebar";
import ChatContainer from "../components/ChatContainer/ChatContainer";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const HomePage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  const token = Cookies.get("jwt");
  const user = jwtDecode(token);

  const usersSidebar = async () => {
    const res = await fetch("/api/get-users-for-sidebar", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      setUsers(data);
      console.log(users);
    }
  };

  useEffect(() => {
    usersSidebar();
  }, []);

  const handleMessages = async (selectedUser) => {
    const res = await fetch(`/${selectedUser._id}`, {
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

  useEffect(() => {
    handleMessages();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/send/${selectedUser._id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Cookies.get("jwt")}`,
        },
        body: JSON.stringify(text),
      });
    } catch (error) {
      console.log(error);
    }
  };

  console.log(text)

  return (
    <AuthContainer>
      <Sidebar>
        {users.map((user) => (
          <Card
            key={user._id}
            fullName={user.fullName}
            onClick={() => setSelectedUser(user)}
          />
        ))}
        <Card />
        {selectedUser && console.log(selectedUser)}
      </Sidebar>
      {selectedUser ? (
        <ChatContainer>
          {messages.map((message) => (
            <div
              key={message._id}
              style={
                message.senderId === user.id
                  ? { textAlign: "right" }
                  : { textAlign: "right" }
              }
            >
              <time>{message.createdAt}</time>
              <p>{message.text}</p>
            </div>
          ))}
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ad modi
            esse rerum molestias similique ab eaque facere? Quos alias deleniti
            voluptatum laborum quo dolores dolore explicabo tempore? Eius,
            nesciunt placeat!
          </p>
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
        </ChatContainer>
      ) : (
        <p>Welcome</p>
      )}
    </AuthContainer>
  );
};

export default HomePage;
