const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');
const requireAuth = require('../middleware/requireAuth');

// Submit contact form
router.post('/contact', requireAuth, supportController.submitContactForm);

// Schedule a visit
router.post('/schedule-visit', requireAuth, supportController.scheduleVisit);

module.exports = router;
