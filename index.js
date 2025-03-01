// Requiring
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const user = require("./models/user");
const userRouter = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
const { verifyToken } = require("./middleware/auth");
// MiddleWare
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET","POST"],
    credentials: true, // Allow cookies & auth headers
})
)
app.use("/protected", verifyToken, (req, res) => {
    if (req.user) {
        res.json({ status: 'validated' });
    }
    else {
        res.json({ status: "Failed" })
    }
});

app.use("/", userRouter);

// Connect to MongoDB 
mongoose.connect("mongodb://localhost:27017/whatsapp-data")
    .then(() => console.log("🚀 connection established with MongoDB"))
    .catch((err) => console.log(err));


app.listen(8000, () => console.log("server is running on port 8000"));

