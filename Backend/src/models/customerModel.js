const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  action: { 
    type: String, 
    enum: ['DISCONNECT_INITIATED', 'EXTENDED', 'RETAINED','TRANSFERRED'], 
    required: true 
  },
  performedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  date: { type: Date, default: Date.now },
  previousDate: { type: Date },
  newDate: { type: Date },      
  reason: { type: String }
});

const CustomerSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  bandwidth: { 
    type: String, 
    required: true,
    trim: true 
  },
  btsId: { 
    type: String, 
    required: true,
    trim: true 
  },
  
  circuitId: { 
    type: String, 
    unique: true,
    required: true,
    trim: true
  },

  managedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },

  status: { 
    type: String, 
    enum: ['Active', 'Pending Disconnection', 'Disconnected'], 
    default: 'Pending Disconnection' 
  },
  
  currentDisconnectDate: { 
    type: Date 
  },

  activityLog: [ActivityLogSchema] 

}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);