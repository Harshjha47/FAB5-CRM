const mongoose = require("mongoose");

const HistoryEntrySchema = new mongoose.Schema({
  action: {
    type: String,
    enum: [
      "CREATED",
      "APPROVED",
      "REJECTED",
      "GENERATION",
      "ACTIVATED",
      "UPGRADE",
      "DOWNGRADE",
      "SHIFTING",
      "IP_ADDITION",
      "DISCONNECT_INITIATED", // Employee Raise Disconnection
      "EXTENDED", // Disconnection Date Extented
      "RETAINED", // Disconnection Cnancelled, Back to Active State
      "TERMINATED", // Disconnection Completed
    ],
    required: true,
  },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  note: { type: String, trim: true },
  date: { type: Date, default: Date.now },

  serviceType: { type: String, enum: ["DNC", "Mix", "ILL", "Peering", "IP"], },
  bandwidth: { type: String },
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
  commercials: {
    mrc: { type: Number, default: 0 },
    ratePerMb: { type: Number, default: 0 },
    otc: { type: Number, default: 0 },
    advance: { type: Number, default: 0 },
  },
  ips: {
    count: { type: Number, default: 0 },
    cost: { type: Number, default: 0 },
  },
  terminationDetails: {
    raiseDate: { type: Date },
    finalDate: { type: Date },
    reason: { type: String, trim: true },
  },
});

// 3. THE MAIN CONNECTION SCHEMA
const ConnectionSchema = new mongoose.Schema(
  {
    opportunityId: {
      type: String,
      trim: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Customer is required"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator is required"],
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    activatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // --- SERVICE DETAILS ---
    serviceType: {
      type: String,
      enum: ["DNC", "Mix", "ILL", "Peering", "IP"],
      required: [true, "Service Type is required"],
    },
    bandwidth: { type: String, required: [true, "Bandwidth is required"] },

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
    commercials: {
      mrc: { type: Number, default: 0 }, // Monthly Recurring Charge
      ratePerMb: { type: Number, default: 0 },
      otc: { type: Number, default: 0 }, // One Time Charge
      advance: { type: Number, default: 0 }, // Advance Payment
    },
    ips: {
      count: { type: Number, default: 0 },
      cost: { type: Number, default: 0 },
    },

    fabCircuitId: { type: String, trim: true },
    telecoCircuitId: { type: String, trim: true },
    acceptanceDate: { type: Date },

    // --- SYSTEM FIELDS ---
    status: {
      type: String,
      enum: ["Pending", "Approved", "Generation", "Active", "Notice Period", "Disconnected", "Rejected"],
      default: "Pending",
    },

    rejectionDetails: {
      reason: { type: String, trim: true },
      rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rejectedAt: { type: Date },
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

ConnectionSchema.index({ opportunityId: 1 }, { unique: true, sparse: true });
ConnectionSchema.index({ customer: 1 });
ConnectionSchema.index({ status: 1 });
ConnectionSchema.index({ createdBy: 1 });
ConnectionSchema.index({ createdAt: -1 });

ConnectionSchema.pre("save", async function (next) {
  if (this.isNew && !this.opportunityId) {

    const generateId = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let id = "";
      for (let i = 0; i < 6; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return id;
    };
    
    let opportunityId;
    let exists = true;
    while (exists) {
      opportunityId = generateId();
      exists = await mongoose.model("Connection").findOne({ opportunityId });
    }

    this.opportunityId = opportunityId;
    this.fabCircuitId = opportunityId;

    /* 
    const now = new Date();
    const yy = String(now.getFullYear()).slice(2); // "25"
    const mm = String(now.getMonth() + 1).padStart(2, "0"); // "03"
    const prefix = `FAB-${yy}${mm}-`; // "FAB-2503-"

    // Find highest existing opportunityId for this month
    const last = await mongoose.model("Connection").findOne(
      { opportunityId: { $regex: `^${prefix}` } },  
      { opportunityId: 1 },
      { sort: { opportunityId: -1 } }
    );

    let nextNumber = 1;
    if (last && last.opportunityId) {
      const lastNumber = parseInt(last.opportunityId.split("-")[2], 10);
      nextNumber = lastNumber + 1;
    }

    this.opportunityId = `${prefix}${String(nextNumber).padStart(5, "0")}`;
    this.fabCircuitId = this.opportunityId; // FAB Circuit ID = Opportunity ID 
    */
  }
  next();
});

module.exports = mongoose.model("Connection", ConnectionSchema);
