const mongoose = require('mongoose');

const contactRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    requester: {
      firstName: { type: String, required: true, trim: true },
      lastName: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, default: '', trim: true },
    },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    metadata: {
      userAgent: { type: String, default: '' },
      ipAddress: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

contactRequestSchema.index({ 'requester.email': 1, createdAt: -1 });

module.exports = mongoose.model('ContactRequest', contactRequestSchema);
