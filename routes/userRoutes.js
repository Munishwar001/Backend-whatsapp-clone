const express = require("express");
const router = express.Router();
const {user , Message}= require("../models/user");
const {verifyToken} = require("../middleware/auth");
const {
    handleSignupUser,
    handleLoginUser,
    handleLoginUserChat,
    handleProtected,
    handleForgotPassword,
    handleResetPassword,
    handleLoginUserData,
    handleUserChatMessages
        } = require("../controllers/user");


router.get("/protected", verifyToken,handleProtected);
router.post("/user/signup",handleSignupUser);
router.post("/user/login",handleLoginUser);
router.get("/chats", verifyToken, handleLoginUserChat);
router.post("/forgot-password", handleForgotPassword); 
router.post("/reset-password", handleResetPassword);
router.get("/loggedUserData",verifyToken,handleLoginUserData)
router.get("/messages/:chatId", verifyToken,handleUserChatMessages); 


module.exports = router;