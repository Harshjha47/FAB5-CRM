const mongoose = require("mongoose");

const poCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequenceValue: { type: Number, default: 0 }
});

module.exports = mongoose.model("PoCounter", poCounterSchema);