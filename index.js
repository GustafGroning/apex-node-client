const express = require("express");
const app = express();
const db = require("./utils/database");
const { passport } = require("./passport");
const {
  generateToken,
  verifyToken,
  getUserIdFromEmail,
} = require("./utils/jsonWebToken");
const { authenticationRouter } = require("./routes/authentication");
const { requireAuth } = require("./middleWare/authenticationMiddleWare");

const session = require("express-session");
const cookieParser = require("cookie-parser");

//############################
// App settings
//############################

app.use(cookieParser());

app.use(
  session({
    secret: "OhSoSecret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", authenticationRouter);

app.use(passport.initialize());
app.use(passport.session());

//############################
// Routes and functionality
//############################
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

function redirectToLogin(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    res.redirect("/login");
  } else {
    verifyToken(token, function (err, decoded) {
      if (err) {
        res.redirect("/login");
      } else {
        req.userId = decoded.userId;
        next();
      }
    });
  }
}

app.get("/test", redirectToLogin, requireAuth, (req, res) => {
  res.send("This is a protected route");
});

app.get("/protected", requireAuth, (req, res) => {
  // find a user by their email
  getUserIdFromEmail(req.userId, (err, userId) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    res.send(`Hello, ${userId}!`);
  });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});
