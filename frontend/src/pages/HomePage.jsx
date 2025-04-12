import React, { useEffect, useState } from "react";
import AuthContainer from "../components/AuthContainer/AuthContainer";
import Card from "../components/Card/Card";
import Sidebar from "../components/Sidebar/Sidebar";
import ChatContainer from "../components/ChatContainer/ChatContainer";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Container from "../components/Container/Container";
import { io } from "socket.io-client";
import StartChat from "../components/StartChat/StartChat";

const HomePage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [connected, setConnected] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const token = Cookies.get("jwt");
  const user = jwtDecode(token);

  const connectSocket = () => {
    const socket = io("http://localhost:3000", {
      query: {
        userId: user.id,
      },
    });
    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

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
      connectSocket();
    }
  };

  useEffect(() => {
    usersSidebar();
  }, []);

  return (
    <Container>
      {(screenWidth > 470 || !selectedUser) && (
        <Sidebar>
          {[...users]
            .sort((a, b) => {
              const aOnline = onlineUsers.includes(a._id);
              const bOnline = onlineUsers.includes(b._id);
              return aOnline === bOnline ? 0 : aOnline ? -1 : 1;
            })
            .map((user) => (
              <Card
                isOnline={onlineUsers.includes(user._id)}
                key={user._id}
                img={user.profilePicture}
                fullName={user.fullName}
                onClick={() => setSelectedUser(user)}
              />
            ))}
          <Card />
        </Sidebar>
      )}

      {(screenWidth > 470 || selectedUser) &&
        (selectedUser ? (
          <ChatContainer
            selectedUser={selectedUser}
            onBack={() => setSelectedUser(null)}
          />
        ) : (
          screenWidth > 470 && <StartChat />
        ))}
    </Container>
  );
};

export default HomePage;
