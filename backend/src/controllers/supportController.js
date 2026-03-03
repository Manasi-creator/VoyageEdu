const ContactRequest = require('../models/ContactRequest');
const VisitRequest = require('../models/VisitRequest');

/**
 * POST /api/contact
 * Simulate sending a contact request and log it for future integrations.
 */
exports.submitContactForm = async (req, res) => {
  const { firstName, lastName, email, phone, subject, message } = req.body || {};

  if (!req.user?.id) {
    return res.status(401).json({ error: 'User not found' });
  }

  if (!firstName || !lastName || !email || !subject || !message) {
    return res.status(400).json({
      error: 'Missing required fields',
      message: 'First name, last name, email, subject, and message are required.'
    });
  }

  try {
    const record = await ContactRequest.create({
      user: req.user.id,
      requester: {
        firstName,
        lastName,
        email,
        phone: phone || '',
      },
      subject,
      message,
      metadata: {
        userAgent: req.get('user-agent') || '',
        ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress || '',
      },
    });

    res.json({
      success: true,
      message: 'Contact request stored successfully',
      id: record._id,
    });
  } catch (error) {
    console.error('❌ Failed to store contact request:', error);
    res.status(500).json({
      error: 'Failed to store contact request',
    });
  }
};

/**
 * POST /api/schedule-visit
 * Simulate scheduling a campus visit.
 */
exports.scheduleVisit = async (req, res) => {
  const { name, visitDate, timeSlot, reason, referralSource } = req.body || {};

  if (!req.user?.id) {
    return res.status(401).json({ error: 'User not found' });
  }

  if (!name || !visitDate || !timeSlot || !reason || !referralSource) {
    return res.status(400).json({
      error: 'Missing required fields',
      message: 'Name, visit date, time slot, reason, and referral source are required.'
    });
  }

  try {
    const record = await VisitRequest.create({
      user: req.user.id,
      visitor: { name },
      schedule: {
        visitDate: new Date(visitDate),
        timeSlot,
        referralSource,
      },
      reason,
      metadata: {
        userAgent: req.get('user-agent') || '',
        ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress || '',
      },
    });

    res.json({
      success: true,
      message: 'Visit request stored successfully',
      id: record._id,
    });
  } catch (error) {
    console.error('❌ Failed to store visit request:', error);
    res.status(500).json({
      error: 'Failed to store visit request',
    });
  }
};
