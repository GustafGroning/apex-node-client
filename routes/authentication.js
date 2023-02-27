const express = require("express");
const authenticationRouter = express.Router();
const { passport } = require("../passport");
const path = require("path");
const bcrypt = require("bcrypt");

const {
  generateToken,
  getUserIdFromEmail,
  verifyToken,
} = require("../utils/jsonWebToken");

const User = require("../models/User");
const db = require("../utils/database");
const jwt = require("jsonwebtoken");
const { user } = require("../utils/database");

//############################
// Sign-up
//############################
authenticationRouter.get("/signup", function (req, res) {
  const filePath = path.join(__dirname, "../views/signup.html");
  res.sendFile(filePath);
});

authenticationRouter.post("/signup", (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  User.findOne({ email }, async (err, user) => {
    if (err) return res.status(500).send(err);

    if (user) {
      return res.status(400).send("User with this email already exists");
    }

    try {
      const newUser = new User({ email, password });
      console.log(newUser);
      await newUser.save();
      res.status(201).send("User created successfully");
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
});

//############################
// Login
//############################
authenticationRouter.get("/login", function (req, res) {
  const filePath = path.join(__dirname, "../views/login.html");
  res.sendFile(filePath);
});

authenticationRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const saltRounds = await bcrypt.getRounds(user.password);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ token });
  } catch (findOneError) {
    console.error(findOneError);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = { authenticationRouter };
