const express = require("express");
const router = express.Router();
const{handleSignupUser ,handleLoginUser , handleLoginUserChat} = require("../controllers/user");
const {user , Message}= require("../models/user");
const {verifyToken} = require("../middleware/auth");

router.post("/user/signup",handleSignupUser);
router.post("/user/login",handleLoginUser);
router.get("/chats", verifyToken, handleLoginUserChat);
// router.post("/send-message", verifyToken, async (req, res) => { 
//     console.log("hello world ");
    
//     try {
//         const { receiver, message } = req.body;
//          console.log("Receiver" , receiver , "Message" , message);
         
//         const newMessage = new Message({
//             sender: req.user.id,  
//             receiver,
//             message
//         });
        
//         await newMessage.save();  
//         res.status(201).json({ msg: "Message sent successfully" });

//     } catch (error) {
//         console.error("Error sending message:", error);
//         res.status(500).json({ msg: "Server error" });
//     }
// }); 

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