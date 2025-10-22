const express = require("express");
const cookie = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const { Server } = require("socket.io");
const http = require("http");
const app = express();

const userRoutes = require("./Routes/UserRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");
const { dbConnection } = require("./Config/dbConnection");

// middleware
app.use(cors());
app.use(express.json());
app.use(cookie());

const server = http.createServer(app);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/message", messageRoutes);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});

// establish a connection
io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room", room);
  });

  socket.on("new message", (newMessage) => {
    let chat = newMessage.chat;
    if (!chat.users) return;
    chat.users.forEach((user) => {
      if (user._id == newMessage.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessage);
    });
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });
});

const serverStart = async () => {
  try {
    await dbConnection();
    console.log("data connected success");
    server.listen(process.env.PORT || 4000, () => {
      console.log("server started");
    });
  } catch (error) {
    console.log(error);
  }
};

serverStart();
