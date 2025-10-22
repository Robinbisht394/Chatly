const chatModel = require("../Model/chatModel");
const messageModel = require("../Model/messageModel");

const sendMessage = async (req, res) => {
  console.log("req came for message");
  console.log(req.body, req.user);

  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.status(400).json({
      success: false,
      error: {
        code: "MISSING_FIELDS",
        message: "Content and chatID are required.",
      },
    });
  }

  try {
    // Create the message document
    let message = await messageModel.create({
      sender: req.user._id,
      content: content,
      chat: chatId,
    });

    message = await messageModel
      .findOne({ _id: message._id })
      .populate("sender", "name email pic")
      .populate("chat")
      .exec();

    await chatModel.findByIdAndUpdate(
      chatId,
      { latestMessage: message },
      { new: true }
    );

    res
      .status(200)
      .json({ success: true, status: "success", chatMessage: message });
  } catch (err) {
    console.error("Error in sendMessage API:", err);

    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong during message processing.",
      },
    });
  }
};

const getAllMessage = async (req, res) => {
  console.log("get messages");

  const { chatId } = req.params;
  console.log(chatId, typeof chatId);

  try {
    const message = await messageModel
      .find({ chat: chatId })
      .populate("sender", "name email pic")
      .populate("chat")
      .sort({ createdAt: 1 });
    console.log(message);

    res.status(200).json({ success: true, status: "success", message });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      status: "success",
      message: "something went wrong",
    });
  }
};

module.exports = { sendMessage, getAllMessage };
