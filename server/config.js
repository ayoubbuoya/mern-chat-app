require("dotenv").config();

const config = {
  PORT: process.env.PORT || 9888,
  FRONTEND: process.env.FRONTEND || "http://localhost:3000",
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/chat-app",
};

module.exports = config;
