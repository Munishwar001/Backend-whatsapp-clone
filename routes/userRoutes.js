const express = require("express");
const router = express.Router();
const{handleSignupUser ,handleLoginUser , handleLoginUserChat} = require("../controllers/user");
const {user , Message}= require("../models/user");
const {verifyToken} = require("../middleware/auth");

router.post("/user/signup",handleSignupUser);
router.post("/user/login",handleLoginUser);
router.get("/chats", verifyToken, handleLoginUserChat);

router.get("/loggedUserData",verifyToken,async(req,res)=>{
    try{
         const currentUser = req.user.id ; 
         const loggeduser = await user.findById(currentUser);
         res.json(loggeduser);
    }
    catch{
        res.status(500).send({message:"Error Occured"});
    }
})


router.get("/messages/:chatId", verifyToken, async (req, res) => {
    try {
        const receiver = req.params.chatId;
        const sender =  req.user.id    
        const messages = await Message.find({ 
            $or: [ { sender: sender , receiver: receiver } ,{ sender: receiver , receiver: sender } ] 
        }).populate("sender receiver", "name"); // Populate sender and receiver details
        
        res.status(200).send(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ msg: "Server error" });
    }
});
module.exports = router;