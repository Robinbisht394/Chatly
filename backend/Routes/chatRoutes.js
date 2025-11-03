const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../MiddleWare/authMiddleware");
const {
  accessChat,
  fetchAllchats,
  createGroupChat,
  renameGroup,
  dropUserFromGroup,
  addUserToGroup,
} = require("../Controller/chatController");

router.route("/").post(authMiddleware, accessChat);
router.route("/").get(authMiddleware, fetchAllchats);
router.route("/groupchat").post(authMiddleware, createGroupChat);
router.route("/renamegroupchat").put(authMiddleware, renameGroup);
router.route("/dropuser").put(authMiddleware, dropUserFromGroup);
router.route("/adduser").put(authMiddleware, addUserToGroup);

module.exports = router;
