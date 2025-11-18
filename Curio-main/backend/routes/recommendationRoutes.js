const { ObjectId } = require("mongodb");
const {
  getAllRecommendations,
  addRecommendation,
  updateRecommendationById,
  deleteRecommendationById,
} = require("../controllers/recommendationController");

module.exports = async function recommendationRoutes(req, res, data, url) {
  const method = req.method.toUpperCase();

  // GET all
  if (method === "GET" && url === "/recommendations") {
    await getAllRecommendations(req, res);
    return true;
  }

  // POST add
  if (method === "POST" && url === "/recommendations") {
    await addRecommendation(req, res, data);
    return true;
  }

  // PUT update
  if (method === "PUT" && url.startsWith("/recommendations/")) {
    const id = url.split("/")[2];
    if (!ObjectId.isValid(id)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid ID" }));
      return true;
    }
    await updateRecommendationById(req, res, id, data);
    return true;
  }

  // DELETE
  if (method === "DELETE" && url.startsWith("/recommendations/")) {
    const id = url.split("/")[2];
    if (!ObjectId.isValid(id)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid ID" }));
      return true;
    }
    await deleteRecommendationById(req, res, id);
    return true;
  }

  return false; // route not handled
};
