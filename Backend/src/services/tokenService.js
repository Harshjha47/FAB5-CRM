const jwt = require("jsonwebtoken");
const crypto = require("crypto");

if(!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const generateAccessToken = (user) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");
  return jwt.sign({ 
    id: user._id,
    role: user.role,
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