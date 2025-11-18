const { getStyles } = require("../models/styleModel");

async function fetchStyles(req, res) {
  const styles = await getStyles();
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ status: "ok", styles }));
}

module.exports = { fetchStyles };
