const express = require("express");
const router = express.Router();
const{handleSignupUser ,handleLoginUser , handleLoginUserChat} = require("../controllers/user");
const {user , Message}= require("../models/user");
const {verifyToken} = require("../middleware/auth");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "munishwar";


router.post("/user/signup",handleSignupUser);
router.post("/user/login",handleLoginUser);
router.get("/chats", verifyToken, handleLoginUserChat);
router.post("/forgot-password", async (req,res)=>{
    try{
    const {email} = req.body;
    const userData = await user.findOne({email});
    console.log( "forgot email" ,userData )
    if(!userData)
        { 
            return res.status(404).json({message:"Email not found"})
        };
        const otp = Math.floor(100000 + Math.random() * 900000);
        userData.otp = otp;
        userData.otpExpire = Date.now() + 300000;
        await userData.save();
        const tokenEmail = jwt.sign({ email: email }, JWT_SECRET, { expiresIn: "1h" });
        // console.log("tokenEmail ", tokenEmail);
        
        res.cookie("tokenEmail", tokenEmail, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 60 * 60 * 1000
        });

const transporter = nodemailer.createTransport({
//   host: "smtp.ethereal.email",
  service:"gmail",
//   port: 587,
//   secure: false, // true for port 465, false for other ports
  auth: {
    user: "kalramunishwar@gmail.com",
    pass: "imspllnjntyugjfk",
  },
});
   async function main() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"WhatsApp OTP Service" <Kalramunishwar@gmail.com>',
    to: email,
    subject: "Your WhatsApp OTP Code",
    text: `Your OTP for WhatsApp verification is: ${otp}. It is valid for 5 minutes.`,
    html: `<p><strong>Your OTP for WhatsApp verification is:</strong> <span style="color:blue;font-size:20px;">${otp}</span></p><p>It is valid for 5 minutes.</p>`,
    
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

main().catch(console.error);
//   res.json({message:"Email sent successfully"})
    console.log(`Your OTP is: ${otp} (valid for 5 minutes)`);
    res.json({ message: "OTP has been sent to your console." });
}catch (err){ 
  console.log(err);
  res.status(500).json({ message: "Internal Server Error" });
}
}) 


router.post("/reset-password",async (req,res)=>{
 try{ 
    const {otp,newPassword} = req.body;
    const tokenEmail = req.cookies.tokenEmail;
    console.log("tokenEmail ", tokenEmail);
    if(!tokenEmail)
        {
            return res.status(404).json({message:"Invalid User"}); 
        }
        const decoded = jwt.verify(tokenEmail, JWT_SECRET);
        const email = decoded.email;
        const userData = await user.findOne({email ,otp , otpExpire:{$gt:Date.now()}});
        if(!userData)
        {
            return res.status(404).json({ message: "Invalid Data" }) 
        }
     userData.password = newPassword;
    //  console.log("reset password", userData);
    userData.otp="";
    userData.otpExpire="";
    userData.save();
    res.status(201).json({message:"password Updated Successfully"});
 }
 catch(err){
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
 }
})
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