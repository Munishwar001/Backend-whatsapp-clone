const {user , Message}= require("../models/user");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "munishwar";

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
    console.log("email :" ,email , password);
    const result = await user.findOne({ email });
    if (!result) {
        return res.status(404).json({ success: false, msg: "Invalid user" });

    }
    const isMatch = (result.password === password);
    if (!isMatch) {
        return res.status(404).json({ success: false, msg: "Invalid credentials" });
    }
    const token = jwt.sign({ id: result._id, email: result.email }, JWT_SECRET, { expiresIn: "1h" });
    console.log("token ", token);

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

module.exports = { handleSignupUser, handleLoginUser , handleLoginUserChat};