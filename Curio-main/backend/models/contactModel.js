const { DB_NAME, client } = require("../config/db");

const COLLECTION = "Contact";

async function saveContact({ name, email, message }) {
  return client.db(DB_NAME).collection(COLLECTION).insertOne({
    name,
    email,
    message,
    createdAt: new Date(),
  });
}

async function getContacts() {
  return client.db(DB_NAME).collection(COLLECTION).find({}).toArray();
}

module.exports = { saveContact, getContacts };
