const mongoose = require('mongoose');


const roleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  entitlements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Entitlement' }],
  description: { type: String },
  active: { type: Boolean, default: true },
});

module.exports = roleSchema;
