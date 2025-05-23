const express = require("express");
require("dotenv").config();
require("./pkg/db/db");
const cors = require("cors");
const { expressjwt: jwt } = require("express-jwt");
const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  sendVerificationMail,
} = require("./handlers/auth");

const {
  newNotification,
  findNotifications,
  deleteNotification,
} = require("./handlers/notifications");
const { updateProfile, findAccount } = require("./handlers/account");
const {
  getUsersForSidebar,
  getMessages,
  sendMessage,
  getUnreadMessages,
  updateUnreadMessages,
} = require("./handlers/message");

const { app, server } = require("./lib/socket");

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.set("view engine", "ejs");
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(
  "/api",
  jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
  }).unless({
    path: [
      "/api/login",
      "/api/register",
      "/api/signup",
      "/api/forgot-password",
      `/api/reset-password/:id/:token`,
      "/api/send-verification-mail",
    ],
  })
);

app.post("/api/signup", signup);
app.post("/api/login", login);
app.post("/api/logout", logout);
app.put("/api/update-profile", updateProfile);
app.post("/api/forgot-password", forgotPassword);
app.put(`/api/reset-password/:id/:token`, resetPassword);
app.post("/api/send-verification-mail", sendVerificationMail);

app.get("/api/get-users-for-sidebar", getUsersForSidebar);
app.get("/api/user/:id", getMessages);
app.post("/api/send/:id", sendMessage);
app.get("/api/get-unread-messages", getUnreadMessages);
app.get("/api/find-account", findAccount);
app.put("/api/update-unread-messages", updateUnreadMessages);

app.post("/api/new-notification", newNotification);
app.get("/api/find-notifications", findNotifications);
app.delete("/api/delete-notifications", deleteNotification);

server.listen(process.env.PORT, () => {
  console.log(`server is up on port ${process.env.PORT}`);
});
