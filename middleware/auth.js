const jwt = require("jsonwebtoken");
const JWT_SECRET = "munishwar";

function verifyToken(req, res, next) {
    const token = req.cookies.token;

    console.log("req.cookies.token  ",req.cookies.token);
    if (!token) {
        return res.status(403).json({ msg: "Access Denied: No token provided" });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            
            console.error("JWT Verification Error:", err.message);
            return res.status(401).json({ msg: "Invalid or expired token" });
        }

        req.user = decoded;  // Attach user info to request 
        console.log("Decoded token:", req.user);
        next();
    });
}

module.exports = { verifyToken };



