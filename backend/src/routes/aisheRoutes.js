const express = require('express');
const router = express.Router();
const aisheController = require('../controllers/aisheController');

// GET /api/aishe/verify/:code
router.get('/verify/:code', aisheController.verifyAisheCode);

module.exports = router;
