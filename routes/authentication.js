const express = require("express");
const authenticationRouter = express.Router();
const { passport } = require("../passport");
const path = require("path");
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

authenticationRouter.post("/signup", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const newUser = new User({ email: email });
  User.register(newUser, password, function (err, user) {
    if (err) {
      console.error(err);
      res.redirect("/signup");
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/");
      });
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

authenticationRouter.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = generateToken(user);
    console.log(token);
    res.cookie("token", token, { httpOnly: true });
    res.status(200).send({ message: "Login successful" });
    // res.status(200).json({ token: token });
  })(req, res, next);
});

module.exports = { authenticationRouter };
