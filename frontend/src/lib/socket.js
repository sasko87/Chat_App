import { io } from "socket.io-client";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

let socket;

export const connectSocket = (userId) => {
  if (!socket) {
    socket = io("http://localhost:3000", {
      query: {
        userId,
      },
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
