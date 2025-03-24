const cloudinaryy = require("../lib/cloudinary");
const { filteredAccount } = require("../pkg/account/account");
const { filteredMessages, createMessage } = require("../pkg/message/message");

const getUsersForSidebar = async (req, res) => {
  try {
    const loggedUserId = req.auth.id;
    const filteredUsers = await filteredAccount({ _id: { $ne: loggedUserId } });
    res.status(200).send(filteredUsers);
  } catch (error) {
    console.log(error);
  }
};

const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user_id;
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
  }
};

const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

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

    res.status(201).send(newMessage);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getUsersForSidebar, getMessages, sendMessage };
