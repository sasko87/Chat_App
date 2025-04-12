import { io } from "socket.io-client";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";

export const connectSocket = () => {
  const token = Cookies.get("jwt");
  const user = jwtDecode(token);
  const [onlineUsers, setOnlineUsers] = useState();
  const [connected, setConnected] = useState(null);

  const socket = io("http://localhost:3000", {
    query: {
      userId: user.id,
    },
  });
  socket.connect();
  setConnected(true);
  socket.on("getOnlineUsers", (userIds) => {
    setOnlineUsers(userIds);
  });
  console.log(onlineUsers);
};
