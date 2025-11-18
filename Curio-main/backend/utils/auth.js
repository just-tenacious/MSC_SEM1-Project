const jwt = require("jsonwebtoken");
const JWT_SECRET = "curioSuperSecretKey123!";

function generateToken(user) {
  return jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
    expiresIn: "1h",
  });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { generateToken, verifyToken };
