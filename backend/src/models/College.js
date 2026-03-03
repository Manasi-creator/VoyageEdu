const mongoose = require('mongoose');

const CollegeSchema = new mongoose.Schema(
  {
    aisheCode: { type: String, index: true },
    name: { type: String, required: true },
    state: { type: String, index: true },
    district: { type: String },
    website: { type: String },
    yearOfEstablishment: { type: Number },
    locationType: { type: String }, // urban / rural

    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },

    geocodingStatus: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending',
      index: true,
    },
    geocodingAttempts: { type: Number, default: 0 },
    fullAddress: { type: String },
  },
  {
    timestamps: true,
  }
);

CollegeSchema.index({ aisheCode: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('College', CollegeSchema, 'colleges');
