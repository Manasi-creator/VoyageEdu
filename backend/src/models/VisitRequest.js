const mongoose = require('mongoose');

const visitRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    visitor: {
      name: { type: String, required: true, trim: true },
      email: { type: String, trim: true, lowercase: true },
      phone: { type: String, trim: true },
    },
    schedule: {
      visitDate: { type: Date, required: true },
      timeSlot: { type: String, required: true, trim: true },
      referralSource: { type: String, required: true, trim: true },
    },
    reason: { type: String, required: true, trim: true },
    metadata: {
      userAgent: { type: String, default: '' },
      ipAddress: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

visitRequestSchema.index({ 'schedule.visitDate': 1, createdAt: -1 });

module.exports = mongoose.model('VisitRequest', visitRequestSchema);
