import Notification from "../models/notification.model.js";

const createNotification = async (req, res) => {
  try {
    const { title, duration, description, status } = req.body;
    const newNotification = new Notification({ title, duration, description, status });
    await newNotification.save();

    res.status(200).json(newNotification);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const editNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, duration, description, status } = req.body;

    let notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    
    notification.title = title || notification.title;
    notification.duration = duration || notification.duration;
    notification.status = status || notification.status;
    notification.description = description || notification.description;
    notification = await notification.save();

    res.status(200).json(notification);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const notificationList = await Notification.find().sort({
        createdAt: -1,
      });
    res.status(200).json(notificationList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: "notification not found" });
    }

    await Notification.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "notification deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getstatistics = async (req, res) => {
  try {
    const notificationCount = await Notification.countDocuments();
    res.status(200).json({notificationCount: notificationCount});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ error: "notification not found" });
    }

    res.status(200).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export {
  getNotifications,
  getstatistics,
  createNotification,
  editNotification,
  getNotification,
  deleteNotification
};
