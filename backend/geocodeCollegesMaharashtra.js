/**
 * Maharashtra Geocoder (Final Version)
 * ------------------------------------
 * 1. Picks only Maharashtra colleges
 * 2. Uses LocationIQ for geocoding
 * 3. Updates latitude, longitude, status
 */

require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const College = require('./src/models/College');   // IMPORTANT: Correct path

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

// LocationIQ
const LOCATIONIQ_KEY = process.env.LOCATIONIQ_API_KEY;
const LOCATIONIQ_URL = "https://us1.locationiq.com/v1/search.php";

// Rate-limits
const LIMIT = 80;           // how many per run
const DELAY = 1200;         // 1.2 sec per request

if (!MONGODB_URI || !LOCATIONIQ_KEY) {
  console.error("❌ Missing MongoDB or LocationIQ keys in .env");
  process.exit(1);
}

async function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function geocode(address) {
  const queries = [
    address,
    address.split(",")[0] + ", Maharashtra, India",
    "Maharashtra, India"
  ];

  for (let q of queries) {
    try {
      const res = await axios.get(LOCATIONIQ_URL, {
        params: {
          key: LOCATIONIQ_KEY,
          q: q,
          format: "json",
          limit: 1
        }
      });

      if (res.data && res.data.length > 0) {
        return {
          lat: parseFloat(res.data[0].lat),
          lon: parseFloat(res.data[0].lon),
          queryUsed: q
        };
      }
    } catch (err) {
      if (err.response?.status === 404) {
        console.log("❌ Not found: ", q);
        continue;
      }
      console.log("⚠️ Error:", err.message);
    }
  }

  return { lat: null, lon: null, queryUsed: "NONE" };
}

async function processColleges() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ MongoDB connected");

  const pending = await College.find({
    state: "Maharashtra",
    geocodingStatus: "pending",
    geocodingAttempts: { $lt: 3 }
  }).limit(LIMIT);

  if (pending.length === 0) {
    console.log("🎉 No Maharashtra colleges left to geocode");
    return;
  }

  console.log(`🔍 Found ${pending.length} records to geocode`);

  for (const college of pending) {
    const address = `${college.name}, ${college.district}, Maharashtra, India`;

    console.log(`\n🗺️ Geocoding: ${college.name}`);
    const coords = await geocode(address);

    const update = {
      latitude: coords.lat,
      longitude: coords.lon,
      geocodingStatus: coords.lat && coords.lon ? "success" : "failed",
      geocodingAttempts: college.geocodingAttempts + 1,
      lastQuery: coords.queryUsed
    };

    await College.findByIdAndUpdate(college._id, { $set: update });
    console.log(`   ➤ Saved: ${coords.lat}, ${coords.lon}`);

    await delay(DELAY);
  }

  console.log("\n✅ Maharashtra geocoding completed!");
  mongoose.connection.close();
}

processColleges();