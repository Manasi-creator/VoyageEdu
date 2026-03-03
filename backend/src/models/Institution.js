const mongoose = require('mongoose');

const InstitutionSchema = new mongoose.Schema({
  aishe_code: { type: String, unique: true },
  name: { type: String, required: true },
  state: { type: String },
  district: { type: String },
  website: { type: String },
  year_of_establishment: { type: Number },
  location_type: { type: String }, // urban / rural

  // Latitude/longitude OPTIONAL so we never block saving a row
  latitude: { type: Number, required: false, default: null },
  longitude: { type: Number, required: false, default: null },

  // What query we used (or "NONE")
  geocode_query: { type: String },
}, {
  timestamps: true
});

module.exports = mongoose.model('Institution', InstitutionSchema, 'institutions');

