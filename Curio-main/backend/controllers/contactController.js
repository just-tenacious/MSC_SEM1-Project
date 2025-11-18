const { saveContact, getContacts } = require("../models/contactModel");

async function addContact(req, res, data) {
  await saveContact(data);
  res.writeHead(201, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ status: "ok" }));
}

async function fetchContacts(req, res) {
  const contacts = await getContacts();
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(contacts));
}

module.exports = { addContact, fetchContacts };
