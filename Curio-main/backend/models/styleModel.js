const { DB_NAME, client } = require("../config/db");
const COLLECTION = "style_details";

async function getStyles() {
  return client.db(DB_NAME).collection(COLLECTION).find({}).toArray();
}

module.exports = { getStyles };
