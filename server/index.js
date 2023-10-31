require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const Server = require("socket.io");

const app = express();

const posts = [
  {
    email: "ayoubamerrr290@gmail.com",
    title: "Post 1",
  },
  {
    email: "hamdi@gmail.com",
    title: "Post 2",
  },
];

const PORT = process.env.PORT || 9888;

// routes
const authRoute = require("./routes/auth");
const contactsRoute = require("./routes/contacts");
const chatsRoute = require("./routes/chats");

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// Define a route
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/contacts", contactsRoute);
app.use("/api/v1/chats", chatsRoute);
app.use("/storage/images", express.static("./storgae/images"));

app.get("/posts", authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.email === req.user.email));
});

// create custom middleware
function authenticateToken(req, res, next) {
  const autHeader = req.headers["authorization"];
  const token = autHeader && autHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "No Acces Token Provided in Reuest Header",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid access token",
      });
    }

    console.log("User : ", user);
    req.user = user;
    console.log("Req.user : ", req.user);
    next();
  });
}

// Start the server
const server = app.listen(PORT, () => {
  console.log("Server started on port ", PORT);
});

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log("User with ID : ", socket.id);
    socket.emit("connected");
  });

  socket.on("join_chat", (room) => {
    socket.join(room);
    console.log("User with ID : ", socket.id, " joined room : ", room);
  });

  socket.on("send_message", (data) => {
    console.log("Data send message : ", data);
    socket.to(data.user.room).emit("new_message", data);
    // socket.to().emit("message_received", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
