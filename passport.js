const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/User");

require("dotenv").config();

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    User.authenticate()
  )
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// module.exports = passport;
module.exports = { passport };
