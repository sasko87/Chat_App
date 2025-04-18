const nodemailer = require("nodemailer");
require("dotenv").config;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAILER_EMAIL?.trim(),
    pass: process.env.MAILER_PASS?.trim(),
  },
});

module.exports = { transporter };
