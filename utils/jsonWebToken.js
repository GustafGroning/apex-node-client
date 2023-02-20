const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const User = require("../models/User");

function generateToken(user) {
  const payload = { userId: user.email };
  console.log(payload);
  const options = { expiresIn: "1h" };
  return jwt.sign(payload, jwtSecret, options);
}

function getUserIdFromEmail(email, callback) {
  User.findOne({ email }, (err, user) => {
    if (err) {
      return callback(err);
    }

    if (!user) {
      return callback(new Error("User not found"));
    }

    const userId = user._id;

    callback(null, userId);
  });
}

function verifyToken(token, callback) {
  const secret = process.env.JWT_SECRET;
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return callback(err);
    }
    const email = decoded.userId; // extract email from decoded payload
    console.log("this is decoded email", email);
    callback(null, decoded);
  });
}

module.exports = { generateToken, getUserIdFromEmail, verifyToken };
