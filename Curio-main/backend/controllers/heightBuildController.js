const heightBuildModel = require("../models/heightBuildModel");

exports.createHeightBuild = async (req, res, data) => {
  try {
    const result = await heightBuildModel.saveHeightBuild(data);
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(result));
  } catch (err) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: err.message }));
  }
};

exports.getHeightBuilds = async (req, res) => {
  try {
    const data = await heightBuildModel.getHeightBuildWithUser();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  } catch (err) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: err.message }));
  }
};
