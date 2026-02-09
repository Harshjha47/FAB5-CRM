const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Please enter a password"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    dob: { type: Date },
    phone: { type: String, trim: true },
    adharNumber: { type: String, unique: true, trim: true, sparse: true },
    panNumber: {
      type: String,
      unique: true,
      uppercase: true,
      trim: true,
      sparse: true,
    },

    role: {
      type: String,
      enum: ["employee", "owner", "project", "admin"],
      default: "employee",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("customers", {
  ref: "Customer",
  localField: "_id",
  foreignField: "managedBy",
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
