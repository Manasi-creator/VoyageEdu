const Institution = require('../models/Institution');

/**
 * GET /api/aishe/verify/:code
 * Normalize AISHE code and verify against Institution collection
 */
exports.verifyAisheCode = async (req, res) => {
  try {
    const rawCode = req.params.code || '';
    const normalizedCode = rawCode.trim().toUpperCase();

    if (!normalizedCode) {
      return res.status(400).json({
        verified: false,
        message: 'AISHE code is required'
      });
    }

    const institution = await Institution.findOne({
      aishe_code: normalizedCode
    }).lean();

    if (!institution) {
      return res.json({ verified: false });
    }

    return res.json({
      verified: true,
      aisheCode: normalizedCode,
      name: institution.name || '',
      state: institution.state || '',
      district: institution.district || '',
      location: institution.location_type || '',
      yearOfEstablishment: institution.year_of_establishment || null
    });
  } catch (error) {
    console.error('Error verifying AISHE code:', error);
    return res.status(500).json({
      verified: false,
      error: 'Failed to verify AISHE code'
    });
  }
};
