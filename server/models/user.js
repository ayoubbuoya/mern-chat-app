require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  picture: {
    type: String,
  },
  accessToken: {
    type: String,
  },
  contacts: [
    {
      type: String || null,
    },
  ],
  messages: [
    {
      type: String || null,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema, "users");
