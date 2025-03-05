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
     socket.on("sendMessage", async({sender,receiver, message})=>{
        try{
            console.log("sender ",sender,"receiver",receiver,"message",message);
            const newMessage = await  Message.create({
            sender, 
            receiver,
            message
        });
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

