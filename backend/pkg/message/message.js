const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema, "messages");

const createMessage = async (data) => {
  const message = new Message(data);
  return await message.save();
};

const filteredMessages = async (filter) => {
  return await Message.find(filter);
};

module.exports = { createMessage, filteredMessages };
