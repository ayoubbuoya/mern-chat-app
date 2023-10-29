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
      type: Number || null,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hashing password before saving it to the database
/* userSchema.pre("save", async function (next) {
  const user = this;
  const salt = process.env.SALT;
  const hashedPassword = await bcrypt.hash(user.password, salt);
  user.password = hashedPassword;
  next();
}); */

module.exports = mongoose.model("User", userSchema, "users");
