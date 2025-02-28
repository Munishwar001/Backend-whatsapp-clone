const user = require("../models/user");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "munishwar";

async function handleSignupUser(req, res) {
    const body = req.body;
    const result = await user.create({
        name: body.name,
        email: body.email,
        password: body.password
    })
    return res.status(200).json({ msg: "data stored successfully" });
}

async function handleLoginUser(req, res) {
    const { email, password } = req.body;
    const result = await user.findOne({ email });
    if (!result) {
        return res.status(404).json({ msg: "Invalid user" });
    }
    const isMatch = (result.password === password);
    if (!isMatch) {
        return res.status(404).json({ msg: "Invalid credentials" });
    }
    const token = jwt.sign({ id: result._id, email: result.email }, JWT_SECRET, { expiresIn: "1h" });
    console.log("token ", token);

    res.cookie("token", token, {
        httpOnly: false,
        secure: false,
        sameSite: "Strict",
        maxAge: 60 * 60 * 1000
    });
    
    return res.status(200).json({ msg: "user login successfully" });
}



module.exports = { handleSignupUser, handleLoginUser };