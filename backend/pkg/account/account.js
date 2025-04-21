const mongoose = require("mongoose");

const accoutSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/6596/6596121.png",
    },
  },
  { timestamps: true }
);

const Account = mongoose.model("Account", accoutSchema, "account");

const createUser = async (account) => {
  const user = new Account(account);
  return await user.save();
};

const getAccountByEmail = async (email) => {
  return await Account.findOne({ email });
};

const getAccountById = async (id) => {
  return await Account.findOne({ _id: id });
};

const updateAccount = async (id, data) => {
  return await Account.updateOne({ _id: id }, data);
};

const filteredAccount = async (filter) => {
  return await Account.find(filter).select("-password");
};
module.exports = {
  createUser,
  getAccountByEmail,
  getAccountById,
  updateAccount,
  filteredAccount,
};
