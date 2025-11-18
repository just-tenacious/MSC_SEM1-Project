const { MongoClient } = require("mongodb");

const URI = "mongodb://127.0.0.1:27017";
const DB_NAME = "curio";
const client = new MongoClient(URI);

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
    return client.db(DB_NAME);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
}

module.exports = { connectDB, client, DB_NAME };
