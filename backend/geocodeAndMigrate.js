// --- 1. Dependencies ---
const mongoose = require('mongoose');
const axios = require('axios');
const xlsx = require('xlsx'); // Used to read Excel (.xlsx) files

// --- 2. Configuration ---
// MongoDB Atlas connection string
const MONGO_URI =
  'mongodb+srv://ramanvhantale_db_user:CK045D4mXeZYkKHA@cluster0.vyhwfbq.mongodb.net/?appName=Cluster0';

// LocationIQ configuration
const LOCATIONIQ_KEY = 'pk.74ae1fd8d793334f2917e3ce222fe949';
const LOCATIONIQ_BASE_URL = 'https://us1.locationiq.com/v1/search.php';

// Excel data file(s)
const DATA_FILES = ['data/Copy of University-ALL UNIVERSITIES(1).xlsx'];

// Rate-limit helper
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// --- 3. Mongoose Schema and Model ---
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
});

const Institution = mongoose.model('Institution', InstitutionSchema, 'institutions');

// --- 4. Geocoding helper (tries multiple queries, handles 404 safely) ---
async function fetchCoordinates(row) {
  const attempts = [
    `${row.name}, ${row.district}, ${row.state}, India`,
    `${row.district}, ${row.state}, India`,
    `${row.state}, India`,
  ];

  for (let q of attempts) {
    try {
      console.log('Searching:', q);

      const url = `${LOCATIONIQ_BASE_URL}?key=${LOCATIONIQ_KEY}&q=${encodeURIComponent(
        q,
      )}&format=json&limit=1`;

      const response = await axios.get(url);

      if (response.data && response.data.length > 0) {
        return {
          lat: parseFloat(response.data[0].lat),
          lon: parseFloat(response.data[0].lon),
          matchedQuery: q,
        };
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        console.log('❌ Location not found for:', q);
        // just try next attempt
        continue;
      }
      console.log('⚠️ Geocoding error:', err.message);
    }
  }

  return {
    lat: null,
    lon: null,
    matchedQuery: 'NONE',
  };
}

// --- 5. Main migration logic ---
async function runMigration() {
  let allInstitutions = [];

  // 5.1 Connect and clear collection
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');
    await Institution.deleteMany({});
    console.log("Existing 'institutions' collection cleared.");
  } catch (err) {
    console.error('Failed to connect or clear MongoDB:', err.message);
    return;
  }

  // 5.2 Read Excel and map rows
  for (const file of DATA_FILES) {
    try {
      const workbook = xlsx.readFile(file);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const data = xlsx.utils.sheet_to_json(sheet, {
        defval: null,
        blankrows: true,
      });

      const mappedData = data.map((row) => {
        const institutionName = row['Name'] || '';
        const state = row['State'] || '';
        const district = row['District'] || '';

        return {
          aishe_code: row['Aishe Code'],
          name: institutionName,
          state,
          district,
          website: row['Website'],
          year_of_establishment:
            row['Year Of Establishment'] === '-'
              ? null
              : parseInt(row['Year Of Establishment'], 10),
          location_type: row['Location'],
          geocode_query: null,
          latitude: null,
          longitude: null,
        };
      });

      allInstitutions = allInstitutions.concat(mappedData);
    } catch (error) {
      console.error(`\n🛑 Failed to read or process file: ${file}, ${error.message}`);
    }
  }

  console.log(`\nSuccessfully read ${allInstitutions.length} records. Starting geocoding...`);

  // 5.3 Geocode each institution (but never crash on errors)
  for (let i = 0; i < allInstitutions.length; i++) {
    const institution = allInstitutions[i];

    process.stdout.write(
      `\r[${i + 1}/${allInstitutions.length}] Geocoding: ${institution.name.substring(0, 40)}...`,
    );

    const coords = await fetchCoordinates({
      name: institution.name,
      district: institution.district,
      state: institution.state,
    });

    institution.latitude = coords.lat;
    institution.longitude = coords.lon;
    institution.geocode_query = coords.matchedQuery;

    // Respect rate limits (about 3–4 requests/second)
    await delay(300);
  }

  console.log('\nFinished geocoding. Inserting into MongoDB...');

  // 5.4 Bulk insert
  try {
    await Institution.insertMany(allInstitutions);
    console.log('\n\n✅ Migration Complete!');
    console.log(`Total records inserted: ${allInstitutions.length}`);
  } catch (err) {
    console.error('\n🛑 Final insertion to MongoDB failed:', err.message);
  } finally {
    mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
}

// Run the migration
runMigration();

 