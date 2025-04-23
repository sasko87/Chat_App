const { getReceiverSocketId } = require("../lib/socket");
const {
  createNotifications,
  getNotifications,
  removeNotifications,
} = require("../pkg/Notifications/Notifications");

const newNotification = async (req, res) => {
  const { senderId, receiverId } = req.body;
  try {
    const notification = await createNotifications({ senderId, receiverId });

    res.status(200).send(notification);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Something went wrong. Try again" });
  }
};

const findNotifications = async (req, res) => {
  try {
    const notifications = await getNotifications({ receiverId: req.auth.id });
    res.status(200).send(notifications);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Something went wrong. Try again" });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { senderId } = req.query;
    const notifications = await removeNotifications({
      receiverId: req.auth.id,
      senderId: senderId,
    });
    res.status(200).send(notifications);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Something went wrong. Try again" });
  }
};

module.exports = { newNotification, findNotifications, deleteNotification };
