require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();
const db = require("../database/db");
const User = require("../models/user");

/* router.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  // if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccesToken({ id: user.id, email: user.email });
    res.json({ accessToken });
  });
}); */

router.post("/register", async (req, res) => {
  try {
    const { email, password, name, username, picture } = req.body;

    // connect to db
    await db();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "User already exists",
      });
    } else {
      hashedPassword = await bcrypt.hash(password, process.env.SALT);
      // create a new user
      const newUser = new User({
        email,
        password: hashedPassword,
        name,
        username,
        picture,
        accessToken: "",
      });

      await newUser.save();

      return res.status(201).json({
        status: "success",
        message: "User created successfully",
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

router.post("/login", async (req, res) => {
  // connect to db and check if the user exists in the db
  await db();

  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      status: "fail",
      message: "User not found",
    });
  }

  console.log("User Found : ", user);
  // check if the password is correct
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  console.log("Password Correct : ", isPasswordCorrect);
  console.log("Password : ", password);
  console.log("User Password : ", user.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({
      status: "fail",
      message: "Incorrect password",
    });
  }

  // Generate a JWT token
  const jwtUser = {
    id: user._id,
    email: user.email,
  };
  const accessToken = jwt.sign(jwtUser, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  user.accessToken = accessToken;

  await user.save();

  res.cookie("accessToken", accessToken, {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
    secure: true,
  });

  return res.status(200).json({
    status: "success",
    message: "User logged in successfully",
    accessToken,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      username: user.username,
      picture: user.picture,
    },
  });
});

router.post("/logout", (req, res) => {
  const accessToken = req.body.token;

  // delte refreshTokens from db
  jwt.verify(accessToken, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid access token",
      });
    }

    console.log("Decoded : ", decoded);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    user.accessToken = "";

    await user.save();
  });

  res.clearCookie("accessToken");

  return res.status(204).json({
    status: "success",
    message: "User logged out successfully",
  });
});

router.get("/me", async (req, res) => {
  const accessToken = req.headers.authorization.split(" ")[1];
  console.log("acces Token ", accessToken);

  if (!accessToken) {
    return res.status(401).json({
      status: "fail",
      message: "No Acces Token Provided in Reuest Header",
    });
  }

  jwt.verify(accessToken, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid access token",
      });
    }

    console.log("Decoded : ", decoded);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "User found",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        username: user.username,
        picture: user.picture,
      },
    });
  });
});

module.exports = router;
