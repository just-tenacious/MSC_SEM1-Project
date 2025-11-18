const faceShapeController = require("../controllers/faceShapeController");
const bodyTypeController = require("../controllers/bodyTypeController");
const heightBuildController = require("../controllers/heightBuildController");

async function analysisRoutes(req, res, data, url) {
  // Normalize the URL: remove trailing slash
  const cleanUrl = url.replace(/\/$/, "");

  // 🧠 Face Shape routes
  if (cleanUrl === "/api/face-shape" && req.method === "POST") {
    await faceShapeController.createFaceShape(req, res, data);
    return true;
  }

  if (cleanUrl === "/api/face-shape" && req.method === "GET") {
    await faceShapeController.getFaceShapes(req, res);
    return true;
  }

  // 🧠 Body Type routes
  if (cleanUrl === "/api/body-type" && req.method === "POST") {
    await bodyTypeController.createBodyType(req, res, data);
    return true;
  }

  if (cleanUrl === "/api/body-type" && req.method === "GET") {
    await bodyTypeController.getBodyTypes(req, res);
    return true;
  }

  // 🧠 Height Build routes
  if (cleanUrl === "/api/height-build" && req.method === "POST") {
    await heightBuildController.createHeightBuild(req, res, data);
    return true;
  }

  if (cleanUrl === "/api/height-build" && req.method === "GET") {
    await heightBuildController.getHeightBuilds(req, res);
    return true;
  }

  return false; // Route not handled
}

module.exports = analysisRoutes;