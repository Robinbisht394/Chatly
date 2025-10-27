const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  isSeen: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Notification", notificationSchema);
