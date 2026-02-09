const mongoose = require('mongoose');

const ServiceRequestSchema = new mongoose.Schema({
  // 1. LINKING (Who is this for?)
  // For "New Order", this might be null initially if Customer isn't created yet, 
  // but usually, you create the Customer profile first, then the Request.
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  lsiId: { type: String }, // The "FAB LSI" (Required for everything except New Order)

  // 2. THE ACTION (What button did they click?)
  requestType: {
    type: String,
    enum: [
      'New Order',      // Growth
      'Upgrade',        // Growth
      'Downgrade',      // Growth
      'Shifting',       // Maintenance
      'IP Addition',    // Maintenance
      'Disconnection',  // Churn
      'Extension',      // Churn Management
      'Retention',      // Churn Management
      'Termination'     // Final Closure
    ],
    required: true
  },

  // 3. THE "OPPORTUNITY" DATA (Sales & Finance)
  // This holds the data from your "Upgrade/New Order" forms
  opportunityDetails: {
    serviceType: { type: String, enum: ['DNC', 'Mix', 'ILL', 'Peering', 'IP'] },
    bandwidth: {
      current: Number, // In Mbps
      requested: Number // The new target speed
    },
    commercials: {
      mrc: Number,      // Monthly Recurring Charge
      otc: Number,      // One Time Charge (Installation)
      advance: Number,
      currency: { type: String, default: 'INR' }
    }
  },

  // 4. TECHNICAL FEASIBILITY (The "Manual" Fields)
  // Since you chose Manual Entry, these are standard Strings.
  technicalDetails: {
    aEnd: {
      btsId: { type: String, trim: true, uppercase: true }, // "Manual Type"
      address: String
    },
    bEnd: {
      btsId: { type: String, trim: true, uppercase: true }, // "Manual Type"
      address: String
    },
    telcoProvider: { type: String }, // Airtel/TCL/Vodafone
    ipCount: Number // For "IP Addition"
  },

  // 5. CHURN MANAGEMENT (For Disconnect/Extend/Retain)
  churnDetails: {
    disconnectionReason: { type: String }, // "High Price", "Moving", etc.
    raiseDate: { type: Date, default: Date.now },
    finalDisconnectionDate: { type: Date } // The target "Cut off" date
  },

  // 6. WORKFLOW STATUS (The Project Manager's View)
  status: {
    type: String,
    enum: [
      'Draft',        // Sales is still typing (optional)
      'Pending',      // Waiting for Owner Approval (Opportunity ID created)
      'Approved',     // Owner said Yes -> Moves to Project Management
      'Rejected',     // Owner said No
      'In Progress',  // Technicians are working
      'Completed'     // Done -> Updates the Main Customer Profile
    ],
    default: 'Pending'
  },

  // 7. AUDIT TRAIL
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Sales Rep
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Owner

}, { timestamps: true });

module.exports = mongoose.model('ServiceRequest', ServiceRequestSchema);