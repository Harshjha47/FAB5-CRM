const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const ROLES = require("../constants/roles")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
      maxLength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    dob: { type: Date },
    phone: {
      type: String,
      trim: true,
      match: [/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"]
    },
    adharNumber: {
      type: String,
      unique: true,
      trim: true,
      sparse: true,
      select: false,
      match: [/^\d{12}$/, "Please enter a valid 12-digit Aadhaar number"]
    },
    panNumber: {
      type: String,
      unique: true,
      uppercase: true,
      trim: true,
      sparse: true,
      select: false,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Please enter a valid PAN number"]
    },

    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.EMPLOYEE,
    },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpire: { type: Date, select: false },
    refreshToken: { type: String, select: false },
    refreshTokenExpire: { type: Date, select: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ role: 1, createdAt: -1 });

userSchema.virtual("customers", {
  ref: "Customer",
  localField: "_id",
  foreignField: "managedBy",
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  if (this.isModified("refreshToken") && this.refreshToken) {
    this.refreshToken = crypto
      .createHash("sha256")
      .update(this.refreshToken)
      .digest("hex");
  }
  if (this.isModified("resetPasswordToken") && this.resetPasswordToken) {
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(this.resetPasswordToken)
      .digest("hex")
  };
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
