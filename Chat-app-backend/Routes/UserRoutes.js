const express = require("express");
const router = express.Router();
const { signup, login, getAllUsers } = require("../Controller/UserContoller");
const { authMiddleware } = require("../MiddleWare/authMiddleware");

router.route("/signup").post(signup); // signup or register
router.route("/login").post(login); // login
router.route("/search").get(authMiddleware, getAllUsers);

module.exports = router;
