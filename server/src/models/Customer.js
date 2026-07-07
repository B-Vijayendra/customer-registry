const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    preferences: {
      preferredCategory: { type: String, default: '' },
      notifyByEmail: { type: Boolean, default: true },
    },
    communicationHistory: [
      {
        channel: { type: String, default: 'system' },
        note: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Customer', customerSchema);
