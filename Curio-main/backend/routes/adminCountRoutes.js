const { getCollectionCounts } = require("../utils/adminCountsUtils");

const adminCountsRoutes = async (req, res, data, url) => {
  if (req.method === "GET" && url === "/admin-counts") {
    try {
      const counts = await getCollectionCounts();

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok", counts }));
      return true;
    } catch (err) {
      console.error("Failed to fetch admin counts:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "error", message: "Server Error" }));
      return true;
    }
  }

  return false;
};

module.exports = adminCountsRoutes;
