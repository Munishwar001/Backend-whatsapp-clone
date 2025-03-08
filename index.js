// Requiring
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const { verifyToken } = require("./middleware/auth"); 
const {createServer} = require("http");
const {user , Message} = require("./models/user")
const multer = require("multer");
const path = require("path");


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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (req.url =="/upload/img")
            cb(null, "uploads/img/"); // store the files in upload folder through multer 
        else
        cb(null, "uploads/"); // Store files in "uploads" folder
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});
// for only image
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"), false);
    }
};


const upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter 
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads/img", express.static(path.join(__dirname, "uploads/img")));


// for adding the image to the database
app.post("/upload", verifyToken, upload.single("profilePic"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded!" });
        }

         const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;

        // Find the logged-in user and update their profile pic
        const updatedUser = await user.findByIdAndUpdate(req.user.id, { dp: imageUrl }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found!" });
        }

        res.status(200).json({ message: "Profile picture updated!",dp: imageUrl, user: updatedUser });
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        res.status(500).json({ message: "Internal server error!" });
    }
});


app.post("/upload/img", verifyToken, upload.single("MsgPic"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded!" });
        }

        const imageUrl = `http://localhost:8000/uploads/img/${req.file.filename}`;

        res.status(200).json({ imageUrl: imageUrl});
    } catch (error) {
        console.error("Error uploading message image:", error);
        res.status(500).json({ message: "Internal server error!" });
    }
});



const http = createServer(app);
const io = new Server(http,{
    cors:{
        origin:"http://localhost:5173",
        methods :["GET","POST"],
        credentials: true,
    }
})  
const userSocket = {};
io.on("connection",(socket)=>{
     console.log(`user connected ${socket.id}`);

    socket.on("register", async (userId)=>{
        console.log("registered users");
        userSocket[userId] = socket.id ;
         console.log("userSocket",userSocket);
     }) 
    socket.on("sendMessage", async ({ sender, receiver, message})=>{
        try{
            console.log("sender ", sender, "receiver", receiver, "message", message);
            const newMessage = await  Message.create({
            sender, 
            receiver,
            message 
        });

        if(message=="")
            return ;
        const receiverSocketId = userSocket[receiver];
        if(receiverSocketId){
           io.to(receiverSocketId).emit("receiveMessage", message);
        }
        }
        catch{
            console.log("hello world");
        }
     })
     
}) 


app.use("/protected", verifyToken, (req, res) => {
    if (req.user) {
        res.json({ status: 'validated' });
    }
    else {
        const http = createServer(app); 
        res.json({ status: "Failed" })
    }
});

app.use("/", userRouter);

// Connect to MongoDB 
mongoose.connect("mongodb://localhost:27017/whatsapp-data")
    .then(() => console.log("🚀 connection established with MongoDB"))
    .catch((err) => console.log(err));



http.listen(8000, () => console.log("server is running on port 8000"));
