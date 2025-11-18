const { fetchStyles } = require("../controllers/styleController");

function styleRoutes(req, res, url) {
  if (url === "/styles" && req.method === "GET") return fetchStyles(req, res);
}

module.exports = styleRoutes;
