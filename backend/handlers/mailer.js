const { transporter } = require("../pkg/mailer/mailer");

const sendMail = async ({ email, message, html }) => {
  await transporter.sendMail({
    from: process.env.MAILER_EMAIL,
    to: email,
    subject: "Your password reset link for Chatting App",
    text: message,
    html,
  });
};

module.exports = { sendMail };
