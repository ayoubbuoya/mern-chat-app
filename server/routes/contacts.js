require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();
const db = require("../database/db");
const User = require("../models/user");
const Conversation = require("../models/conversation");
const authenticateToken = require("../middlewares/authenticateUser");

// get all contacts from the user where id = req.user.id
router.get("/", authenticateToken, async (req, res) => {
  try {
    // connect to db
    await db();
    const user = await User.findOne({ _id: req.user.id });
    const contacts = [];
    // get contact details of each id in user.contacts
    for (let i = 0; i < user.contacts.length; i++) {
      const contact = user.contacts[i];
      const contactDetails = await User.findOne({ _id: contact });

      contacts.push({
        id: contactDetails._id,
        name: contactDetails.name,
        username: contactDetails.username,
        picture: contactDetails.picture,
      });
    }
    return res.status(200).json({
      status: "success",
      contacts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
});

router.post("/add", authenticateToken, async (req, res) => {
  try {
    const { username } = req.body;

    // connect to db
    await db();

    // get user details
    const user = await User.findOne({ _id: req.user.id });

    // check if user exists
    const contact = await User.findOne({ username });

    if (!contact) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    // check if contact already exists
    if (user.contacts.includes(contact._id)) {
      return res.status(400).json({
        status: "fail",
        message: "Contact already exists",
      });
    }

    // add contact to user's contacts
    user.contacts.push(contact.id);
    await user.save();

    // add user to contact's contacts
    contact.contacts.push(user.id);
    await contact.save();

    return res.status(200).json({
      status: "success",
      message: "Contact added successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
