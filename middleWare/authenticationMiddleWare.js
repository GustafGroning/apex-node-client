const { verifyToken } = require("../utils/jsonWebToken");

//############################
// Auth token handling
//############################
function requireAuth(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    res.redirect("/login");
    // return res.status(401).json({ message: "No token provided" });
  }

  verifyToken(token, function (err, decoded) {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.userId = decoded.userId;
    next();
  });
}

module.exports = { requireAuth };
