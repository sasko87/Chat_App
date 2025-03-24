const express = require("express");
require("dotenv").config();
require("./pkg/db/db");
const cors = require("cors");
const { expressjwt: jwt } = require("express-jwt");
const { signup, login, logout, checkAuth } = require("./handlers/auth");
const { updateAccount } = require("./pkg/account/account");
const { updateProfile } = require("./handlers/account");
const {
  getUsersForSidebar,
  getMessages,
  sendMessage,
} = require("./handlers/message");

const app = express();

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
    path: ["/api/login", "/api/register", "/api/check"],
  })
);
app.post("/api/signup", signup);
app.post("/api/login", login);
app.post("/api/logout", logout);
app.put("/api/update-profile", updateProfile);
app.get("/api/check", checkAuth);

app.get("/api/get-users-for-sidebar", getUsersForSidebar);
app.get("/api/:id", getMessages);
app.post("/api/send/:id", sendMessage);

app.listen(process.env.PORT, () => {
  console.log(`server is up on port ${process.env.PORT}`);
});
