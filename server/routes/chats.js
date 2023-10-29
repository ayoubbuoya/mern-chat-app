const express = require("express");
const router = express.Router();
const db = require("../database/db");
const Message = require("../models/message");
const authenticateToken = require("../middlewares/authenticateUser");
const User = require("../models/user");

// get all chats that the user is involved in
router.get("/", authenticateToken, async (req, res) => {
  try {
    // connect to db
    await db();

    const id = req.user.id;

    // find user by id
    const user = await User.findOne({ _id: req.user.id });

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    //  empty array to store all conversations betwenn the user and others in the user.contacts
    let chats = [];

    // looping on user.contacts
    for (let i = 0; i < user.contacts.length; i++) {
      // get contact details
      const contact = await User.findOne({ _id: user.contacts[i] });

      // get all messages between the user and the contact
      const messages = await Message.find({
        $or: [
          {
            sender_username: user.username,
            receiver_username: contact.username,
          },
          {
            sender_username: contact.username,
            receiver_username: user.username,
          },
        ],
      });

      // serialze messages
      for (let i = 0; i < messages.length; i++) {
        messages[i] = {
          id: messages[i]._id,
          sender_username: messages[i].sender_username,
          receiver_username: messages[i].receiver_username,
          message: messages[i].message,
          createdAt: messages[i].createdAt,
        };
      }

      // push the messages to the chats array
      chats.push({
        contact: {
          id: contact._id,
          name: contact.name,
          username: contact.username,
          picture: contact.picture,
        },
        messages: messages,
      });
    }

    return res.status(200).json({
      status: "success",
      chats,
    });
  } catch (error) {
    console.error("Get chats error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

// send a message to a contact
router.post("/send", authenticateToken, async (req, res) => {
  const { receiver_username, message } = req.body;

  // connect to db
  await db();

  // get sender details
  const user = await User.findOne({ _id: req.user.id });

  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }

  // check if receiver exists
  const receiver = await User.findOne({ username: receiver_username });

  if (!receiver) {
    return res.status(404).json({
      status: "fail",
      message: "Receiver not found",
    });
  }

  // check if receiver is in user.contacts
  if (!user.contacts.includes(receiver._id)) {
    return res.status(400).json({
      status: "fail",
      message: "Receiver not in your contacts",
    });
  }

  // send message
  const newMessage = new Message({
    sender_username: user.username,
    receiver_username,
    message,
  });

  await newMessage.save();

  return res.status(200).json({
    status: "success",
    message: "Message sent",
  });
});

module.exports = router;
