const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;

const User = require("../models/User");

function generateToken(user) {
  const payload = { userId: user.email };
  console.log(payload);
  const options = { expiresIn: "1h" };
  return jwt.sign(payload, jwtSecret, options);
}

function getUserEmailFromId(id, callback) {
  console.log(id);
  User.findById(id, (err, user) => {
    if (err) {
      return callback(err);
    }

    if (!user) {
      return callback(new Error("User not found"));
    }

    const email = user.email;

    callback(null, email);
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

module.exports = { generateToken, getUserEmailFromId, verifyToken };
