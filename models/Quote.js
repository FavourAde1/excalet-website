const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  service: { type: String },
  message: { type: String },
  status: { type: String, default: 'New' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quote', quoteSchema);