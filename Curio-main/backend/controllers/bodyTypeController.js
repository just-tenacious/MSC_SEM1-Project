const bodyTypeModel = require("../models/bodyTypeModel");

exports.createBodyType = async (req, res, data) => {
  try {
    const result = await bodyTypeModel.saveBodyType(data);
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(result));
  } catch (err) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: err.message }));
  }
};

exports.getBodyTypes = async (req, res) => {
  try {
    const data = await bodyTypeModel.getBodyTypesWithUser();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  } catch (err) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: err.message }));
  }
};

