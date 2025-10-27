const express = require("express");
const app = express();
const router = express.Router();
const {
  setNofication,
  getNotification,
  updateNotification,
} = require("../Controller/notificationController");
const {authMiddleware} = require("../MiddleWare/authMiddleware");

router.post("/", setNofication);
router.get("/", authMiddleware, getNotification);
router.put("/", updateNotification);

module.exports = router;
