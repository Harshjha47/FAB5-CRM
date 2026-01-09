const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const cloudinary = require("../config/cloudinary");
const {sendEmail} = require("../utils/sendEmail");

const sentOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    await sendEmail(email,otp);
    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({
      email,
      password,
    });
    const generateToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", generateToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(201).json({
      success: true,
      user,
      token: generateToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const generateToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", generateToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({
      success: true,
      user,
      token: generateToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const requestReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User with this email does not exist" });
    }

    res.status(200).json({ message: "Email verified, OTP sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and new password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update password
    user.password = password;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//  Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("customers");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUser = async (req,res)=>{
  try{
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if(user.role.equals('admin')){
      return res.status(401).json({ message: "User not authorized" });
    }
    const users= await User.find()

  }catch(err){
    res.status(500).json({ message: err.message });
  }
}

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("customers");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, dob, phone, adharNumber, panNumber } = req.body;

    if (!name || !dob || !phone || !adharNumber || !panNumber) {
      return res.status(400).json({ message: "all field must be filled" });
    }

    user.name = req.body.name || user.name;
    user.dob = req.body.dob || user.dob;
    user.phone = req.body.phone || user.phone;
    user.adharNumber = req.body.adharNumber || user.adharNumber;
    user.panNumber = req.body.panNumber || user.panNumber;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    const { password, ...userData } = updatedUser.toObject();

    res.status(200).json({
      message: "Profile updated successfully",
      user: userData,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const logoutUser = (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  requestReset,
  resetPassword,
  logoutUser,
  sentOtp,
  getAllUser,
};
