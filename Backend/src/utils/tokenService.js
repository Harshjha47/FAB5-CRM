const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const generateAccessToken = (user) => {
  return jwt.sign({ 
    id: user._id,
    role: user.role,
    email: user.email  
  }, process.env.JWT_SECRET, 
  {
    expiresIn: "15m",
  });
}

const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString("hex");
}
const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
}

module.exports = { generateAccessToken, generateRefreshToken, hashToken }