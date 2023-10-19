require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 9888;

app.use(cors());

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// Define a route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the server
app.listen(PORT, () => {
  console.log("Server started on port ", PORT);
});
