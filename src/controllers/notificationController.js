import Notification from '../models/notificationModel.js';

export const createNotification = async (req, res) => {
  const { userId, message, type, url } = req.body;

  try {
    const notification = new Notification({
      userId,
      message,
      type,
      url,
      createdAt: new Date()
    });
    await notification.save();
    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getNotifications = async (req, res) => {
  const { userId } = req.params;

  try {
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};