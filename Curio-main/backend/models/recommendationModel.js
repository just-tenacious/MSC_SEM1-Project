const { ObjectId } = require("mongodb");
const { DB_NAME, client } = require("../config/db");

const COLLECTION = "recommendation_master";

// Save new recommendation
async function saveRecommendation(data) {
  const now = new Date();
  const recDoc = {
    title: data.title,
    desc: data.desc,
    icon: data.icon,
    created_at: now,
    updated_at: now,
  };
  return client.db(DB_NAME).collection(COLLECTION).insertOne(recDoc);
}

// Find all recommendations or with a query
async function findRecommendations(query = {}) {
  return client.db(DB_NAME).collection(COLLECTION).find(query).toArray();
}

// Find single recommendation by query
async function findRecommendation(query) {
  return client.db(DB_NAME).collection(COLLECTION).findOne(query);
}

// Update recommendation by id
async function updateRecommendation(id, updates) {
  updates.updated_at = new Date();
  return client.db(DB_NAME).collection(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    { $set: updates }
  );
}

// Delete recommendation by id
async function deleteRecommendation(id) {
  return client.db(DB_NAME).collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
}

module.exports = {
  saveRecommendation,
  findRecommendations,
  findRecommendation,
  updateRecommendation,
  deleteRecommendation,
};
