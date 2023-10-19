const mongoose = require("mongoose");
const crypto = require("crypto");

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
});

// Hashing password before saving it to the database
userSchema.pre("save", function (next) {
  const user = this;
  const salt = crypto.randomBytes(32).toString("hex");
  const hash = crypto
    .pbkdf2Sync(user.password, salt, 10000, 64, "sha512")
    .toString("hex");
  user.password = [salt, hash].join("$");
  next();
});

module.exports = mongoose.model("User", userSchema, "users");
