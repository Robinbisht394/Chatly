const express = require("express");
const { authMiddleware } = require("../MiddleWare/authMiddleware");
const {
  sendMessage,
  getAllMessage,
} = require("../Controller/messageController");

const router = express.Router();

router.route("/").post(authMiddleware, sendMessage);
router.route("/:chatId").get(authMiddleware, getAllMessage);

module.exports = router;
