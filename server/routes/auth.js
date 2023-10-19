const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const router = express.Router();
const db = require("../database/db");
const User = require("../models/user");

const JWT_SECRET = process.env.JWT_SECRET;

router.get("/", (req, res) => {
  res.send("Hello In The Auth api");
});

router.post("/login", async (req, res) => {
  // connect to db and check if the user exists in the db
  await db();

  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400).json({
      status: "fail",
      message: "User not found",
    });
  }

  console.log(user);

  /* const [salt, hash] = user.password.split("$");
  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  if (hash !== hashedPassword) {
    res.status(400).json({
      status: "fail",
      message: "Incorrect password",
    });
  } */

  // check if the password is correct
  if (user.password !== password) {
    res.status(400).json({
      status: "fail",
      message: "Incorrect password",
    });
  }

  // Generate a JWT token
  const accessToken = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET);
  console.log(accessToken);

  res.status(200).json({
    status: "success",
    message: "User logged in successfully",
    accessToken,
  });
});

module.exports = router;
