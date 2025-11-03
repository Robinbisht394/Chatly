const notificationModel = require("../Model/notificationModel");
const setNofication = async (req, res) => {
  const { chat, content } = req.body;
  try {
    const notification = new notificationModel({
      chat: chat,
      content: content,
    });
    await notification.save();
    if (notification) {
      return res
        .status(201)
        .json({ success: true, status: "success", data: notification });
    }
  } catch (err) {
    return res.status(500).json({
      success: true,
      status: "success",
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong !",
      },
    });
  }
};

const getNotification = async (req, res) => {
  const { user } = req;
  console.log("get notif", user);

  try {
    const userNotifications = await notificationModel.find({
      isSeen: false,
      "chat.users": { $elemMatch: { match: user._id } },
    });
    if (!userNotifications) {
      return res
        .status(404)
        .json({ success: true, status: "success", message: "No Notification" });
    }

    return res
      .status(200)
      .json({ success: true, status: "success", data: userNotifications });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      status: "error",
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong !",
      },
    });
  }
};

const updateNotification = async (req, res) => {
  const { id } = req.body;

  try {
    const updatedNotification = await notificationModel.find(
      { _id: id },
      { isSeen: true }
    );
    return res
      .status(200)
      .json({ success: true, status: "success", data: updatedNotification });
  } catch (err) {
    return res.status(500).json({
      success: true,
      status: "success",
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong !",
      },
    });
  }
};

module.exports = { setNofication, getNotification, updateNotification };
