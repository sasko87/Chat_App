const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { getAccountByEmail, createUser } = require("../pkg/account/account");

const signup = async (req, res) => {
  const { fullName, email, password, profilePicture } = req.body;
  try {
    const user = await getAccountByEmail(email);
    if (user) {
      return res.status(400).send({ message: "Email already exists" });
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
    console.log(error);
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getAccountByEmail(email);

    if (!user) {
      return res.status(400).send({ message: "User does not exists" });
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

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });

    return res.status(200).send({ message: "Successcfull login" });
  } catch (error) {
    console.log(error);
  }
};
const logout = async (req, res) => {
  try {
    res.cookie("jwt", "");
    res.status(200).send({ message: "Logout successfuly" });
  } catch (error) {
    console.log(error);
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

module.exports = { signup, login, logout, checkAuth };
