const { transporter } = require("../pkg/mailer/mailer");

const sendMail = async ({ email, message, html, subject }) => {
  await transporter.sendMail({
    from: `"ChatHub" <${process.env.MAILER_EMAIL}>`,
    to: email,
    subject,
    text: message,
    html,
  });
};

module.exports = { sendMail };
