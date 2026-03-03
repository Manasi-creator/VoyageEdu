/**
 * Script: importCollegesMaharashtra.js (FINAL ERROR-FREE VERSION)
 * ---------------------------------------------------------------
 * Reads the Excel sheet, filters Maharashtra colleges, and upserts
 * records into MongoDB with geocodingStatus=pending.
 */

require("dotenv").config();
const path = require("path");
const xlsx = require("xlsx");
const mongoose = require("mongoose");
const College = require("./src/models/College"); // IMPORTANT: correct model path

// Excel file path
const EXCEL_PATH = path.join(
  __dirname,
  "data",
  "Copy of College-ALL COLLEGE (1).xlsx"
);

// MongoDB URI (accept both MONGODB_URI and legacy MONGO_URI)
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGODB_URI) {
  console.error("❌ ERROR: Missing MONGODB_URI in .env file.");
  process.exit(1);
}

/**
 * Connect to MongoDB (no deprecated options)
 */
async function connectToDatabase() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB");
}

/**
 * Read Excel and extract Maharashtra rows
 */
function readMaharashtraRows() {
  const workbook = xlsx.readFile(EXCEL_PATH);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const rows = xlsx.utils.sheet_to_json(sheet, { defval: null });

  return rows.filter((row) => {
    const state = (row["State"] || "").trim().toLowerCase();
    return (
      state === "maharashtra" &&
      row["Name"] &&
      row["District"]
    );
  });
}

/**
 * Build clean payload for MongoDB insert
 */
function buildCollegePayload(row) {
  const name = row["Name"]?.toString().trim() || "";
  const district = row["District"]?.toString().trim() || "";

  return {
    aisheCode:
      row["Aishe Code"]?.toString().trim() || null,

    name,
    state: "Maharashtra",
    district,
    website:
      row["Website"]?.toString().trim() || "",

    yearOfEstablishment:
      row["Year Of Establishment"] &&
      row["Year Of Establishment"] !== "-"
        ? Number(row["Year Of Establishment"])
        : null,

    locationType:
      row["Location"]?.toString().trim().toLowerCase() || null,

    latitude: null,
    longitude: null,

    geocodingStatus: "pending",
    geocodingAttempts: 0,

    // Full formatted address for better geocoding
    fullAddress: `${name}, ${district}, Maharashtra, India`,
  };
}

/**
 * Insert or update rows in MongoDB
 */
async function upsertColleges(rows) {
  let success = 0;
  let failed = 0;

  for (const row of rows) {
    const payload = buildCollegePayload(row);

    // Prefer AisheCode as unique filter; fallback to name + district
    const filter = payload.aisheCode
      ? { aisheCode: payload.aisheCode }
      : {
          name: payload.name,
          district: payload.district,
          state: "Maharashtra",
        };

    try {
      await College.findOneAndUpdate(
        filter,
        { $set: payload },
        { upsert: true }
      );
      success++;
    } catch (err) {
      failed++;
      console.error(
        `⚠️ Failed to import: ${payload.name} (${payload.district}) - ${err.message}`
      );
    }
  }

  console.log(`\n✅ Import complete:`);
  console.log(`   ✔ Success: ${success}`);
  console.log(`   ❌ Failed: ${failed}`);
}

/**
 * Main flow
 */
async function main() {
  try {
    await connectToDatabase();

    console.log(`📘 Reading Excel: ${EXCEL_PATH}`);

    const rows = readMaharashtraRows();
    console.log(`📍 Found ${rows.length} Maharashtra colleges`);

    if (rows.length === 0) {
      console.warn("⚠️ No Maharashtra rows found in Excel!");
      return;
    }

    await upsertColleges(rows);
  } catch (err) {
    console.error("🛑 Import failed:", err.message);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
  }
}

main();
