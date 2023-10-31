const express = require("express");
const router = express.Router();
const db = require("../database/db");
const Message = require("../models/message");
const authenticateToken = require("../middlewares/authenticateUser");
const User = require("../models/user");
const Conversation = require("../models/conversation");

// get all chats that the user is a participant in
router.get("/", authenticateToken, async (req, res) => {
  try {
    // connect db
    await db();

    // get user details
    const user = await User.findOne({ _id: req.user.id });

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    let chats = [];

    // get all conversations that contains user.id from table conversation
    const conversations = await Conversation.find({
      participants: { $in: [req.user.id] },
    });

    for (let i = 0; i < conversations.length; i++) {
      const chat = conversations[i].toObject();
      // rename chat._id to chat.id
      chat.id = chat._id;
      delete chat._id;
      delete chat.__v;

      // get other participant details
      const otherParticipant = await User.findOne({
        _id: { $ne: req.user.id, $in: chat.participants },
      });

      chat.participants = [
        {
          id: user._id,
          name: user.name,
          username: user.username,
          picture: user.picture,
        },
        {
          id: otherParticipant._id,
          name: otherParticipant.name,
          username: otherParticipant.username,
          picture: otherParticipant.picture,
        },
      ];
      // get all messages of the conversation
      const messages = await Message.find({
        _id: { $in: chat.messages },
      });

      // serialize messages
      chat.messages = messages.map((message) => {
        return {
          id: message._id,
          sender_id: message.sender_id,
          receiver_id: message.receiver_id,
          message: message.message,
          createdAt: message.createdAt,
        };
      });
      // serialize chat object
      chats.push(chat);
    }

    return res.status(200).json({
      status: "success",
      chats: chats,
    });
  } catch (error) {
    console.error("Get all conversations error:", error);
    return res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
});

// get a specific chat
router.get("/:chatId", authenticateToken, async (req, res) => {
  try {
    // connect db

    await db();

    // get conversation
    const conversation = await Conversation.findOne({
      _id: req.params.chatId,
    });

    if (!conversation) {
      return res.status(404).json({
        status: "fail",
        message: "Conversation not found",
      });
    }

    // check if the user is a participant in the conversation
    if (!conversation.participants.includes(req.user.id)) {
      return res.status(400).json({
        status: "fail",
        message: "You are not a participant in this conversation",
      });
    }

    return res.status(200).json({
      status: "success",
      chat: conversation,
    });
  } catch (error) {
    console.error("Get chat error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

// get other particpants of a conversation
router.get("/:chatId/participants", authenticateToken, async (req, res) => {
  try {
    // connect db
    await db();

    // get conversation
    const conversation = await Conversation.findOne({
      _id: req.params.chatId,
    });

    if (!conversation) {
      return res.status(404).json({
        status: "fail",
        message: "Conversation not found",
      });
    }

    // check if the user is a participant in the conversation
    if (!conversation.participants.includes(req.user.id)) {
      return res.status(400).json({
        status: "fail",
        message: "You are not a participant in this conversation",
      });
    }

    // get participants
    const participants = await User.find({
      _id: { $in: conversation.participants },
    });

    // serialize participants
    for (let i = 0; i < participants.length; i++) {
      participants[i] = {
        id: participants[i]._id,
        name: participants[i].name,
        username: participants[i].username,
        picture: participants[i].picture,
      };
    }

    return res.status(200).json({
      status: "success",
      participants,
    });
  } catch (error) {
    console.error("Get participants error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

// get all messages of a conversation
router.get("/:chatId/messages", authenticateToken, async (req, res) => {
  try {
    // connect db
    await db();

    // get conversation
    const conversation = await Conversation.findOne({
      _id: req.params.chatId,
    });

    if (!conversation) {
      return res.status(404).json({
        status: "fail",
        message: "Conversation not found",
      });
    }

    // check if the user is a participant in the conversation
    if (!conversation.participants.includes(req.user.id)) {
      return res.status(400).json({
        status: "fail",
        message: "You are not a participant in this conversation",
      });
    }

    // get messages
    const messages = await Message.find({
      _id: { $in: conversation.messages },
    });

    // serialize messages
    for (let i = 0; i < messages.length; i++) {
      messages[i] = {
        id: messages[i]._id,
        sender_id: messages[i].sender_id,
        receiver_id: messages[i].receiver_id,
        message: messages[i].message,
        createdAt: messages[i].createdAt,
      };
    }

    return res.status(200).json({
      status: "success",
      messages,
    });
  } catch (error) {
    console.error("Get messages error:", error);
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
    sender_id: user._id,
    receiver_id: receiver._id,
    message,
  });

  await newMessage.save();

  // check if there is a conversation between them (by checking if their ids exists in Conversation.participants)
  const conversation = await Conversation.findOne({
    participants: { $all: [user._id, receiver._id] },
  });

  if (conversation) {
    // add the message to the conversation
    conversation.messages.push(newMessage._id);
    await conversation.save();
  } else {
    // create a new conversation
    const newConversation = new Conversation({
      participants: [user._id, receiver._id],
      messages: [newMessage._id],
    });

    await newConversation.save();
  }

  return res.status(200).json({
    status: "success",
    message: "Message sent",
  });
});

module.exports = router;
