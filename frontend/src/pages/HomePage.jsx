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
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [unreadMessages, setUnreadMessages] = useState();
  const [socket, setSocket] = useState();
  const [notifications, setNotifications] = useState([]);
  const token = Cookies.get("jwt");
  const user = jwtDecode(token);
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setSocket(
      io(
        "http://localhost:3000",

        {
          query: {
            userId: user.id,
          },
        }
      )
    );
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleGetOnlineUsers = (userIds) => {
      setOnlineUsers(userIds);
    };

    socket.on("getOnlineUsers", handleGetOnlineUsers);

    // Clean up the event listener when component unmounts or socket changes
    return () => {
      socket.off("getOnlineUsers", handleGetOnlineUsers);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (data) => {
      setNotifications((prev) => [...prev, data]);
    };

    notifications && socket.on("getNotification", handleNotification);

    return () => {
      socket.off("getNotification", handleNotification);
    };
  }, [socket]);

  // const connectSocket = () => {
  //   const socket =
  //   });
  // };

  const getNotifications = async () => {
    const res = await fetch("/api/find-notifications", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("jwt")}`,
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const data = await res.json();
      setNotifications(data);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

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
      // connectSocket();
    }
  };

  const getUnreadMessages = async () => {
    const unreadMessages = await fetch("/api/get-unread-messages", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("jwt")}`,
      },
    });
    if (unreadMessages.ok) {
      const data = await unreadMessages.json();
      setUnreadMessages(data);
      usersSidebar();
      console.log("unread", data);
    }
  };

  useEffect(() => {
    usersSidebar();
    getUnreadMessages();
  }, []);

  return (
    <>
      <Container>
        {(screenWidth > 470 || !selectedUser) && (
          // <Sidebar>
          //   {[...users]
          //     .sort((a, b) => {
          //       const aOnline = onlineUsers.includes(a._id);
          //       const bOnline = onlineUsers.includes(b._id);
          //       return aOnline === bOnline ? 0 : aOnline ? -1 : 1;
          //     })
          //     .map((user) => (
          //       <Card
          //         isOnline={onlineUsers.includes(user._id)}
          //         key={user._id}
          //         img={user.profilePicture}
          //         fullName={user.fullName}
          //         onClick={() => setSelectedUser(user)}
          //         notifications={notifications}
          //         style={{
          //           background: notifications.some(
          //             (notification) => notification.senderId === user._id
          //           )
          //             ? "gray"
          //             : "transparent",
          //         }}
          //       />
          //     ))}
          // </Sidebar>
          <Sidebar>
            {[...users]
              .filter((user) => user._id !== user.id) // ✅ filter out logged-in user
              .sort((a, b) => {
                const aHasNotification = notifications.some(
                  (n) => n.senderId === a._id
                );
                const bHasNotification = notifications.some(
                  (n) => n.senderId === b._id
                );

                if (aHasNotification !== bHasNotification) {
                  return aHasNotification ? -1 : 1;
                }

                const aOnline = onlineUsers.includes(a._id);
                const bOnline = onlineUsers.includes(b._id);

                if (aOnline !== bOnline) {
                  return aOnline ? -1 : 1;
                }

                return 0;
              })
              .map((user) => (
                <Card
                  isOnline={onlineUsers.includes(user._id)}
                  key={user._id}
                  img={user.profilePicture}
                  fullName={user.fullName}
                  onClick={() => setSelectedUser(user)}
                  notifications={notifications}
                  style={{
                    background: notifications.some(
                      (notification) => notification.senderId === user._id
                    )
                      ? "grey"
                      : "transparent",
                  }}
                />
              ))}
          </Sidebar>
        )}

        {(screenWidth > 470 || selectedUser) &&
          (selectedUser ? (
            <ChatContainer
              selectedUser={selectedUser}
              onBack={() => setSelectedUser(null)}
              onlineUsers={onlineUsers}
              socket={socket}
              setNotifications={setNotifications}
              unreadMessages={unreadMessages}
            />
          ) : (
            screenWidth > 470 && <StartChat />
          ))}
      </Container>
    </>
  );
};

export default HomePage;
