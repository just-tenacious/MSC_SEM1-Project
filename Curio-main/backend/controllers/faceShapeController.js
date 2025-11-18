const faceShapeModel = require("../models/faceShapeModel");

exports.createFaceShape = async (req, res, data) => {
  try {
    const result = await faceShapeModel.saveFaceShape(data);
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(result));
  } catch (err) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: err.message }));
  }
};

exports.getFaceShapes = async (req, res) => {
  try {
    const data = await faceShapeModel.getFaceShapesWithUser();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  } catch (err) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: err.message }));
  }
};
