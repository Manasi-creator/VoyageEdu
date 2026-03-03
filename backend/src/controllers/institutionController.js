const Institution = require('../models/Institution');
const { fetchWebsiteMetadata } = require('../utils/websiteScraper');

/**
 * GET /api/institutions/geolocated-count
 * Returns the count of institutions with valid geolocation data
 */
exports.getGeolocatedCount = async (req, res) => {
  try {
    const count = await Institution.countDocuments({
      latitude: { $ne: null, $type: 'number' },
      longitude: { $ne: null, $type: 'number' }
    });
    
    res.json({ count });
  } catch (error) {
    console.error('Error counting geolocated institutions:', error);
    res.status(500).json({ 
      error: 'Failed to count geolocated institutions',
      message: error.message 
    });
  }
};


/**
 * GET /api/institutions
 * Returns all institutions with coordinates from MongoDB
 */
// In your institutionController.js, update the getAllInstitutions function
exports.getAllInstitutions = async (req, res) => {
  try {
    const { search, location_type, state, sort = 'name', page = 1, perPage = 10, flat } = req.query;
    
    // Build the base query shared by both response types
    const baseQuery = {
      latitude: { $ne: null, $type: 'number' },
      longitude: { $ne: null, $type: 'number' }
    };
    
    if (search) {
      baseQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } },
        { 'aishe_code': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (location_type && location_type !== 'all') {
      baseQuery.location_type = location_type;
    }
    
    if (state && state !== 'all') {
      baseQuery.state = state;
    }
    
    // Handle sorting
    let sortOption = {};
    if (sort) {
      const sortOrder = sort.startsWith('-') ? -1 : 1;
      const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
      sortOption[sortField] = sortOrder;
    } else {
      sortOption = { name: 1 };
    }

    // Flat response for maps and legacy clients
    if (flat === 'true') {
      const institutions = await Institution.find(baseQuery)
        .sort(sortOption)
        .select('name state district website latitude longitude aishe_code year_of_establishment location_type city type');

      const formatted = institutions.map((inst) => {
        const city = inst.city || inst.district || '';
        const stateName = inst.state || '';
        const addressParts = [city, stateName].filter(Boolean);

        return {
          _id: inst._id.toString(),
          name: inst.name,
          lat: inst.latitude,
          lng: inst.longitude,
          city,
          district: inst.district || '',
          state: stateName,
          address: addressParts.join(', '),
          website: inst.website || '',
          aishe_code: inst.aishe_code || '',
          year_of_establishment: inst.year_of_establishment ?? null,
          location_type: inst.location_type || '',
          type: inst.type || inst.location_type || 'Educational Institution'
        };
      });

      return res.json(formatted);
    }
    
    // Paginated/grouped response (default)
    const cities = (await Institution.distinct('city', baseQuery)).filter(Boolean).sort();
    
    const pageNum = parseInt(page) || 1;
    const perPageNum = parseInt(perPage) || 10;
    const totalCities = cities.length;
    const totalPages = Math.ceil(totalCities / perPageNum) || 1;
    const startIndex = (pageNum - 1) * perPageNum;
    const endIndex = pageNum * perPageNum;
    const paginatedCities = cities.slice(startIndex, endIndex);
    
    const paginatedQuery = { ...baseQuery };
    if (paginatedCities.length > 0) {
      paginatedQuery.city = { $in: paginatedCities };
    }
    
    const institutions = await Institution.find(paginatedQuery)
      .sort(sortOption)
      .select('name state district website latitude longitude aishe_code year_of_establishment location_type city type');
    
    const institutionsByCity = paginatedCities.map(city => ({
      city,
      institutions: institutions.filter(inst => inst.city === city)
    })).filter(group => group.institutions.length > 0);
    
    res.json({
      currentPage: pageNum,
      totalPages,
      totalCities,
      cities: institutionsByCity
    });
    
  } catch (error) {
    console.error('Error fetching institutions:', error);
    res.status(500).json({ error: 'Failed to fetch institutions' });
  }
};
/**
 * GET /api/institutions/with-metadata
 * Returns all institutions with website metadata fetched in real-time
 */
exports.getInstitutionsWithMetadata = async (req, res) => {
  try {
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    // Fetch institutions from MongoDB
    const institutions = await Institution.find({
      latitude: { $ne: null, $type: 'number' },
      longitude: { $ne: null, $type: 'number' }
    }).select('name state district website latitude longitude aishe_code year_of_establishment location_type').limit(50); // Limit to 50 for performance

    // Transform and enrich with website metadata (process in parallel with timeout protection)
    const enrichedInstitutions = await Promise.allSettled(
      institutions.map(async (inst) => {
        const baseData = {
          _id: inst._id.toString(),
          name: inst.name,
          lat: inst.latitude,
          lng: inst.longitude,
          city: inst.district || '',
          state: inst.state || '',
          address: `${inst.district || ''}, ${inst.state || ''}`.trim(),
          website: inst.website || '',
          aishe_code: inst.aishe_code || '',
          year_of_establishment: inst.year_of_establishment || null,
          location_type: inst.location_type || '',
          // Default values
          description: '',
          image: '',
          type: inst.location_type || 'Educational Institution'
        };

        // Fetch website metadata if website exists (with timeout)
        if (inst.website) {
          try {
            // Add timeout wrapper
            const metadataPromise = fetchWebsiteMetadata(inst.website);
            const timeoutPromise = new Promise((resolve) => 
              setTimeout(() => resolve(null), 5000) // 5 second timeout per website
            );
            
            const metadata = await Promise.race([metadataPromise, timeoutPromise]);
            
            if (metadata) {
              // Merge metadata, prioritizing website data but keeping MongoDB data
              baseData.description = metadata.description || baseData.description;
              baseData.image = metadata.image || baseData.image;
              if (metadata.type && metadata.type !== 'website') {
                baseData.type = metadata.type;
              }
            }
          } catch (error) {
            // Silently fail and continue with MongoDB data only
            console.error(`Failed to fetch metadata for ${inst.website}:`, error.message);
          }
        }

        return baseData;
      })
    );

    // Filter out failed promises and extract values
    const successfulInstitutions = enrichedInstitutions
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value);

    res.json(successfulInstitutions);
  } catch (error) {
    console.error('Error fetching institutions with metadata:', error);
    res.status(500).json({ 
      error: 'Failed to fetch institutions',
      message: error.message 
    });
  }
};

/**
 * GET /api/institutions/:id
 * Returns a single institution by ID
 */
exports.getInstitutionById = async (req, res) => {
  try {
    // Set headers to prevent caching
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    const institution = await Institution.findById(req.params.id);
    
    if (!institution) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    res.json({
      _id: institution._id.toString(),
      name: institution.name,
      lat: institution.latitude,
      lng: institution.longitude,
      city: institution.district || '',
      state: institution.state || '',
      address: `${institution.district || ''}, ${institution.state || ''}`.trim(),
      website: institution.website || '',
      aishe_code: institution.aishe_code || '',
      year_of_establishment: institution.year_of_establishment || null,
      location_type: institution.location_type || ''
    });
  } catch (error) {
    console.error('Error fetching institution:', error);
    res.status(500).json({ 
      error: 'Failed to fetch institution',
      message: error.message 
    });
  }
};

