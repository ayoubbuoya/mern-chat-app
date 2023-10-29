require("dotenv").config();
const jwt = require("jsonwebtoken");

// create custom middleware
function authenticateToken(req, res, next) {
  const autHeader = req.headers["authorization"];
  const token = autHeader && autHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "No Acces Token Provided in Reuest Header",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid access token",
      });
    }

    console.log("User : ", user);
    req.user = user;
    console.log("Req.user : ", req.user);
    next();
  });
}

module.exports = authenticateToken;
