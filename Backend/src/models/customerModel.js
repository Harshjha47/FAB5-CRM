const mongoose = require('mongoose');

const BillingProfileSchema = new mongoose.Schema({
  label: { type: String, trim: true },
  gstNumber: {
    type: String,
    trim: true,
    uppercase: true,
    // match: [
    //   /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    //   "Please enter a valid GST Number",
    // ],
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: {
      type: String,
      trim: true,
      match: [/^\d{6}$/, "Please enter a valid pincode"],
    },
  },
});

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the company name"],
    trim: true
  },
  person: {
    type: String,
    required: [true, "Please enter the person name"], // Contact Person
    trim: true
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
  },
  mobile: {
    type: String,
    required: [true, "Please enter a mobile number"],
    trim: true,
    match: [/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"],
  },

  kycDocuments: [
    {
      documentType: {
        type: String,
        default: "Aadhar",
      },
      fileName: String,
      url: String,
      publicId: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

  billingProfile: [BillingProfileSchema],

  // Metadata
  managedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "Customer must be assigned to an Employee"]
  },
  isActive: { type: Boolean, default: true }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

CustomerSchema.index({ email: 1 });
CustomerSchema.index({ managedBy: 1 });
CustomerSchema.index({ isActive: 1 });
CustomerSchema.index({ createdAt: -1 });
CustomerSchema.index({ name: "text" })

CustomerSchema.virtual("connections", {
  ref: "Connection",
  localField: "_id",
  foreignField: "customer",
});

module.exports = mongoose.model('Customer', CustomerSchema);