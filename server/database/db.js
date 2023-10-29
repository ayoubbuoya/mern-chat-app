const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

// connect to mongo
const db = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB connection failed");
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = db;
