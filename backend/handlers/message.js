const cloudinaryy = require("../lib/cloudinary");
const { getReceiverSocketId } = require("../lib/socket");
const { filteredAccount } = require("../pkg/account/account");
const {
  filteredMessages,
  createMessage,
  findUnreadMessages,
  updateAllUnreadMessages,
} = require("../pkg/message/message");

const { io } = require("../lib/socket");

const getUsersForSidebar = async (req, res) => {
  try {
    const loggedUserId = req.auth.id;
    const filteredUsers = await filteredAccount({ _id: { $ne: loggedUserId } });
    res.status(200).send(filteredUsers);
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    console.log(req.auth.id);
    const senderId = req.auth.id;
    const message = await filteredMessages({
      $or: [
        {
          senderId: senderId,
          receiverId: userToChatId,
        },
        {
          senderId: userToChatId,
          receiverId: senderId,
        },
      ],
    });

    res.status(200).send(message);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal server error" });
  }
};

const getUnreadMessages = async (req, res) => {
  try {
    const unreadMessages = await findUnreadMessages({
      receiverId: req.auth.id,
      read: false,
    });
    res.status(200).send(unreadMessages);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal server error" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.auth.id;
    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinaryy.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await createMessage({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
      io.to(receiverSocketId).emit("getNotification", { senderId });
    }

    res.status(201).send(newMessage);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal server error" });
  }
};

const updateUnreadMessages = async (req, res) => {
  const receiverId = req.auth.id;
  const senderId = req.body.senderId;

  const data = { read: req.body.read };
  try {
    const messages = await filteredMessages({
      receiverId: receiverId,
      senderId: senderId,
      read: false,
    });

    for (const message of messages) {
      await updateAllUnreadMessages(message._id, { read: true });
    }

    res.status(200).send(messages);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal server error" });
  }
};

module.exports = {
  getUsersForSidebar,
  getMessages,
  sendMessage,
  getUnreadMessages,
  updateUnreadMessages,
};
