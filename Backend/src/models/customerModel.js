const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, // Company Identity
  person: { type: String, required: true, trim: true }, 
  email: { type: String, required: true, trim: true, lowercase: true },
  mobile: { type: String, required: true, trim: true },

  billingProfiles: [{
    label: { type: String },
    gstNumber: { type: String, trim: true, uppercase: true },
    address: {  
      street: String,
      city: String,
      state: String,
      pincode: String
    }
  }],

  // Metadata
  managedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true }

}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);