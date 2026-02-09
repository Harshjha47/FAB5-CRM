const mongoose = require("mongoose");

const HistoryEntrySchema = new mongoose.Schema({
  action: {
    type: String,
    enum: [
      "CREATED",
      "UPGRADE",
      "DOWNGRADE",
      "SHIFTING",
      "IP_ADDITION",
      "DISCONNECT_INITIATED",
      "EXTENDED",
      "RETAINED",
      "TERMINATED",
    ],
    required: true,
  },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  serviceType: {
    type: String,
    enum: ["DNC", "Mix", "ILL", "Peering", "IP"],
    required: true,
  },
  technicalDetails: {
    aEnd: {
      btsId: { type: String, trim: true },
      address: { type: String, trim: true },
    },
    bEnd: {
      btsId: { type: String, trim: true },
      address: { type: String, trim: true },
    },
    telcoProvider: {
      type: String,
      enum: ["Airtel", "TCL", "Vodafone", "Jio", "Other"],
    },
  },
  bandwidth: { type: String },
  commercials: {
    mrc: { type: Number, default: 0 },
    ratePerMb: { type: Number, default: 0 },
    otc: { type: Number, default: 0 },
    advance: { type: Number, default: 0 },
  },
  terminationDetails: {
    raiseDate: { type: Date }, // Disconnection Raise date
    finalDate: { type: Date }, // Final Disconnection Date
    reason: { type: String, trim: true }, // Reason for disconnection
  },
  date: { type: Date, default: Date.now },
});

// 3. THE MAIN CONNECTION SCHEMA
const ConnectionSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    // --- SERVICE DETAILS ---
    serviceType: {
      type: String,
      enum: ["DNC", "Mix", "ILL", "Peering", "IP"],
      required: true,
    },

    // --- TECHNICAL DETAILS ---
    technicalDetails: {
      aEnd: {
        btsId: { type: String, trim: true },
        address: { type: String, trim: true },
      },
      bEnd: {
        btsId: { type: String, trim: true },
        address: { type: String, trim: true },
      },
      telcoProvider: {
        type: String,
        enum: ["Airtel", "TCL", "Vodafone", "Jio", "Other"],
      },
    },

    // --- COMMERCIALS ---
    bandwidth: { type: String, required: true },
    commercials: {
      mrc: { type: Number, default: 0 }, // Monthly Recurring Charge
      ratePerMb: { type: Number, default: 0 },
      otc: { type: Number, default: 0 }, // One Time Charge
      advance: { type: Number, default: 0 }, // Advance Payment
    },

    // --- SYSTEM FIELDS ---
    status: {
      type: String,
      enum: ["Pending", "Approved", "Active", "Notice Period", "Disconnected"],
      default: "Pending",
    },

    circuitId: {
      acceptanceDate: { type: Date },
      fabCircuitId: { type: String, trim: true },
      talcoCircuitId: { type: String, trim: true },
    },
    terminationDetails: {
      raiseDate: { type: Date },
      finalDate: { type: Date },
      reason: { type: String, trim: true },
    },

    // --- THE TRACKER ---
    history: [HistoryEntrySchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Connection", ConnectionSchema);
