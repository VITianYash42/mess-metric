const mongoose = require('mongoose');

const wasteLogSchema = new mongoose.Schema({
  wasteKg: {
    type: Number,
    required: true
  }
}, {
  timestamps: true // createdAt will be used for reporting
});

module.exports = mongoose.model('WasteLog', wasteLogSchema);