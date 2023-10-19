const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const PORT = process.env.PORT || 7000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// socket setup
io.on("connection", (socket) => {
  console.log("User connected With Id", socket.id);
  // when it diconnects
  io.on("dicsonnect", () => {
    console.log(`User Disconnected with Id ${socket.id}`);
  });

  // when it sends a message
  socket.on("message", (msg) => {
    console.log("message: " + msg);
    socket.broadcast.emit("message", msg);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
