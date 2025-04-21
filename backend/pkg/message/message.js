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
    read: {
      type: Boolean,
      default: false,
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

const findUnreadMessages = async (filter) => {
  return await Message.find(filter).distinct("senderId");
};

const updateAllUnreadMessages = async (id, data) => {
  return await Message.updateMany({ _id: id }, data);
};

module.exports = {
  createMessage,
  filteredMessages,
  findUnreadMessages,
  updateAllUnreadMessages,
};
