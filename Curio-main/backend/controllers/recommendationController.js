const {
  saveRecommendation,
  findRecommendations,
  findRecommendation,
  updateRecommendation,
  deleteRecommendation,
} = require("../models/recommendationModel");
const { ObjectId } = require("mongodb");

// GET all recommendations
async function getAllRecommendations(req, res) {
  try {
    const recs = await findRecommendations();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(recs));
  } catch (err) {
    console.error(err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Failed to fetch recommendations" }));
  }
}

// POST new recommendation
async function addRecommendation(req, res, data) {
  try {
    const result = await saveRecommendation(data);
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Recommendation added", id: result.insertedId }));
  } catch (err) {
    console.error(err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Failed to add recommendation" }));
  }
}

// PUT update recommendation
async function updateRecommendationById(req, res, id, data) {
  try {
    const existing = await findRecommendation({ _id: new ObjectId(id) });
    if (!existing) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Recommendation not found" }));
    }

    await updateRecommendation(id, data);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Recommendation updated" }));
  } catch (err) {
    console.error(err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Failed to update recommendation" }));
  }
}

// DELETE recommendation
async function deleteRecommendationById(req, res, id) {
  try {
    await deleteRecommendation(id);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Recommendation deleted" }));
  } catch (err) {
    console.error(err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Failed to delete recommendation" }));
  }
}

module.exports = {
  getAllRecommendations,
  addRecommendation,
  updateRecommendationById,
  deleteRecommendationById,
};
