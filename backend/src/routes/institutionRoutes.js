const express = require('express');
const router = express.Router();
const institutionController = require('../controllers/institutionController');

// GET count of geolocated institutions
router.get('/geolocated-count', institutionController.getGeolocatedCount);

// GET all institutions
router.get('/', institutionController.getAllInstitutions);

// GET all institutions with website metadata
router.get('/with-metadata', institutionController.getInstitutionsWithMetadata);

// GET single institution by ID
router.get('/:id', institutionController.getInstitutionById);

module.exports = router;

