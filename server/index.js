require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

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

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// Define a route
app.use("/api/v1/auth", authRoute);

app.get("/posts", authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.email === req.user.email));
});

// create custom middleware
function authenticateToken(req, res, next) {
  const autHeader = req.headers["authorization"];
  const token = autHeader && autHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    console.log("User : ", user);
    req.user = user;
    console.log("Req.user : ", req.user);
    next();
  });
}

// Start the server
app.listen(PORT, () => {
  console.log("Server started on port ", PORT);
});
