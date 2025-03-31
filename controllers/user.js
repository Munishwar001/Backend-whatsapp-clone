const {user , Message}= require("../models/user");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const JWT_SECRET = "munishwar";


async function handleProtected(req, res) {
    if (req.user) {
        res.json({ status: 'validated' });
    }
    else {
        res.json({ status: "Failed" })
    }
}


async function handleSignupUser(req, res) {
    const body = req.body;
    const result = await user.create({
        name: body.name,
        email: body.email,
        password: body.password , 
        
    })
    return res.status(200).json({ msg: "data stored successfully" });
}


async function handleLoginUser(req, res) {
    const { email, password } = req.body;
    // console.log("email :" ,email , password);
    const result = await user.findOne({ email });
    if (!result) {
        return res.status(404).json({ success: false, msg: "Invalid user" });

    }
    const isMatch = (result.password === password);
    if (!isMatch) {
        return res.status(404).json({ success: false, msg: "Invalid credentials" });
    }
    const token = jwt.sign({ id: result._id, email: result.email }, JWT_SECRET, { expiresIn: "1h" });
   // console.log("token ", token);

    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
        maxAge: 60 * 60 * 1000
    });
//    console.log("JWT token received in cookies: ", req.cookies.token);
    return res.status(200).json({ success: true, msg: "User login successfully" });
}


async function  handleLoginUserChat(req,res){
    try {
        const loggedInUserId = req.user.id;

        const chats = await user.find({ _id: { $ne: loggedInUserId } }); 
        console.log("loggedUser",req.user);
        res.json({chats :chats , loggedUser : req.user})
    } catch (error) {
        console.error("Error fetching chats:", error);
        res.status(500).json({ msg: "Server error" });
    }
} 


async function handleForgotPassword(req,res) {
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
}

main().catch(console.error);
    console.log(`Your OTP is: ${otp} (valid for 5 minutes)`);
    res.json({ message: "OTP has been sent to your console." });
}catch (err){ 
  console.log(err);
  res.status(500).json({ message: "Internal Server Error" , otp : otp});
} }


async function handleResetPassword(req,res) {
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
    userData.otp="";
    userData.otpExpire="";
    userData.save();
    res.status(201).json({message:"password Updated Successfully"});
 }
 catch(err){
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
 }
}


async function handleLoginUserData(req,res) {
    try{
         const currentUser = req.user.id ; 
         const loggeduser = await user.findById(currentUser);
         res.json(loggeduser);
    }
    catch{
        res.status(500).send({message:"Error Occured"});
    }
}


async function handleUserChatMessages(req, res) {
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
}
module.exports = {
    handleSignupUser,
    handleLoginUser,
    handleLoginUserChat,
    handleProtected,
    handleForgotPassword,
    handleResetPassword,
    handleLoginUserData,
    handleUserChatMessages
};