const express = require("express");
require("dotenv").config();
require("./pkg/db/db");
const cors = require("cors");
const { expressjwt: jwt } = require("express-jwt");
const { signup, login, logout } = require("./handlers/auth");

const { updateProfile, findAccount } = require("./handlers/account");
const {
  getUsersForSidebar,
  getMessages,
  sendMessage,
} = require("./handlers/message");
const { app, server } = require("./lib/socket");

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  "/api",
  jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
  }).unless({
    path: ["/api/login", "/api/register", "/api/signup"],
  })
);
app.post("/api/signup", signup);
app.post("/api/login", login);
app.post("/api/logout", logout);
app.put("/api/update-profile", updateProfile);

app.get("/api/get-users-for-sidebar", getUsersForSidebar);
app.get("/api/user/:id", getMessages);
app.post("/api/send/:id", sendMessage);
app.get("/api/find-account", findAccount);

app.listen(process.env.PORT, () => {
  console.log(`server is up on port ${process.env.PORT}`);
});
