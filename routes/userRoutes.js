const express = require("express");
const router = express.Router();
const{handleSignupUser ,handleLoginUser , handleLoginUserChat} = require("../controllers/user");
const user = require("../models/user");
const {verifyToken} = require("../middleware/auth");

router.post("/user/signup",handleSignupUser);
router.post("/user/login",handleLoginUser);
router.get("/chats", verifyToken, handleLoginUserChat);

module.exports = router;