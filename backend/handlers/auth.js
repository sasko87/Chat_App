const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const ejs = require("ejs");
const path = require("path");

const {
  getAccountByEmail,
  createUser,
  getAccountById,
  updateAccount,
} = require("../pkg/account/account");
const { sendMail } = require("./mailer");
let verificationCodes = {};
const sendVerificationMail = async (req, res) => {
  const { email, fullName } = req.body;
  const user = await getAccountByEmail(email);

  console.log(user);

  if (user) {
    return res
      .status(400)
      .send({ error: "User with this email already exists" });
  }

  const verificationCode = Math.floor(100000 + Math.random() * 900000);
  const expiresAt = Date.now() + 60 * 60 * 1000;

  verificationCodes[email] = {
    code: verificationCode,
    expiresAt,
  };
  const templatePath = path.join(__dirname, "../views/verification-email.ejs");

  const htmlContent = await ejs.renderFile(templatePath, {
    fullName,
    verificationCode,
  });

  try {
    await sendMail({
      email: email,
      subject: "Your verification code for ChatHub",

      html: htmlContent,
    });
    return res.status(200).send({ message: "Verification code sent to email" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Failed to send verification code" });
  }
};

// const verifyCode = async (req, res) => {
//   const { email, code } = req.body;
//   const savedEmail = verificationCodes[email];

//   if (!savedEmail) {
//     return res.status(400).send({ error: "No verification code found" });
//   }

//   if (Date.now() > record.expiresAt) {
//     delete verificationCodes[email];
//     return res.status(400).send({ error: "Verification code expired" });
//   }

//   if (code !== record.code) {
//     return res.status(400).send({ error: "Incorrect verification code" });
//   }

//   delete verificationCodes[email];
//   return res.status(200).send({ message: "Email verified successfully" });
// };

const signup = async (req, res) => {
  const { email, password, code } = req.body;
  try {
    const savedEmail = verificationCodes[email];

    if (!savedEmail) {
      return res.status(400).send({ error: "No verification code found" });
    }

    if (Date.now() > savedEmail.expiresAt) {
      delete verificationCodes[email];
      return res.status(400).send({ error: "Verification code expired" });
    }

    if (parseInt(code) !== savedEmail.code) {
      return res.status(400).send({ error: "Incorrect verification code" });
    }

    delete verificationCodes[email];

    req.body.password = bcrypt.hashSync(password);

    const newUser = await createUser(req.body);

    if (newUser) {
      const payload = {
        id: newUser._id,
        name: newUser.fullName,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.cookie("jwt", token, {
        // httpOnly: true,
        // sameSite: "strict",
        // secure: process.env.NODE_ENV !== "development",
      });
    }

    return res.status(200).send({ message: "Acccout successfuly created" });
  } catch (error) {
    return res.status(500).send({ error: "Something went wrong. Try again" });
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getAccountByEmail(email);

    if (!user) {
      return res.status(400).send({ error: "User does not exists" });
    }
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).send({ error: "Wrong password" });
    }

    const payload = {
      id: user._id,
      name: user.fullName,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token);

    return res.status(200).send({
      message: "Successcfull login. You will be redirected to Homepage",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Something went wrong. Try again" });
  }
};
const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      expires: new Date(0),
    });
    res.status(200).send({ message: "Logout successfuly" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Something went wrong. Try again" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await getAccountByEmail(email);

  if (!user) {
    return res.status(400).send({ error: "User does not exist" });
  }

  const secret = process.env.JWT_SECRET;

  const payload = {
    email: user.email,
    fullName: user.fullName,
    id: user.id,
  };

  const token = jwt.sign(payload, secret, { expiresIn: "60m" });
  const link = `https://chat.stevkovski.xyz/reset-password/${user.id}/${token}`;

  const templatePath = path.join(__dirname, "../views/forgot-password.ejs");

  const htmlContent = await ejs.renderFile(templatePath, {
    fullName: user.fullName,
    link: link,
  });

  try {
    await sendMail({
      email: email,
      subject: "Your password reset link for Chatting App",
      html: htmlContent,
    });
    return res.status(200).send({
      message: "Password reset link sent to your email address",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: "Something went wrong. Please try again." });
  }
};

const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    res.status(400).send({ error: "Password do not match" });
    return;
  }

  const user = await getAccountById(id);
  const hashedNewPassword = bcrypt.hashSync(newPassword);
  const secret = process.env.JWT_SECRET;

  try {
    const payload = jwt.verify(token, secret);
    if (!payload) {
      res.status(400).send({ error: "Token not valid!" });
    }
    await updateAccount(user.id, { password: hashedNewPassword });
    res.status(200).send({ message: "Password reset successful!" });
  } catch (error) {
    return res.status(500).send({ error: "Password not changed" });
  }
};

module.exports = {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  sendVerificationMail,
};
