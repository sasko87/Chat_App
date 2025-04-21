const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notifications = mongoose.model(
  "Notification",
  NotificationSchema,
  "notifications"
);

const createNotifications = async (data) => {
  const notifications = new Notifications(data);
  return await notifications.save();
};

const getNotifications = async (filter) => {
  return Notifications.find(filter);
};

const removeNotifications = async (filter) => {
  return await Notifications.deleteMany(filter);
};

module.exports = { createNotifications, getNotifications, removeNotifications };
