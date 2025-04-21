const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const {
  getAccountByEmail,
  createUser,
  getAccountById,
  updateAccount,
} = require("../pkg/account/account");
const { sendMail } = require("./mailer");

const signup = async (req, res) => {
  const { fullName, email, password, profilePicture } = req.body;
  try {
    const user = await getAccountByEmail(email);
    if (user) {
      return res.status(400).send({ error: "Email already exists" });
    }

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
    return res.status(500).send("Internal Server Error");
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
    return res.status(500).send({ error: "Internal Server Error" });
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
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  const user = await getAccountByEmail(email);

  if (!user) {
    return res.status(400).send({ message: "User does not exist" });
  }

  const secret = process.env.JWT_SECRET;

  const payload = {
    email: user.email,
    fullName: user.fullName,
    id: user.id,
  };

  const token = jwt.sign(payload, secret, { expiresIn: "60m" });
  const link = `https://chat.stevkovski.xyz/reset-password/${user.id}/${token}`;

  console.log(link);

  const htmlContent = `
  <p>Hello ${user.fullName},</p>
  <p>You requested a password reset. Click the link below to reset your password:</p>
  <a href="${link}">Reset Password</a>
  <p>This link will expire in 60 minutes.</p>
`;

  try {
    await sendMail({
      email: email,
      message: htmlContent,
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
  checkAuth,
  forgotPassword,
  resetPassword,
};
