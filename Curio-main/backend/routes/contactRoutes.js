const { addContact, fetchContacts } = require("../controllers/contactController");

function contactRoutes(req, res, data, url) {
  if (url === "/contact" && req.method === "POST") return addContact(req, res, data);
  if (url === "/contact" && req.method === "GET") return fetchContacts(req, res);
}

module.exports = contactRoutes;
