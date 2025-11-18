// const { register, login, updateProfile, getMe } = require("../controllers/userController");

// function userRoutes(req, res, data, url) {
//   if (url === "/register" && req.method === "POST") return register(req, res, data);
//   if (url === "/login" && req.method === "POST") return login(req, res, data);
//   if (url === "/update-profile" && req.method === "POST") return updateProfile(req, res, data);
//   if (url === "/me" && req.method === "GET") {
//     const token = req.headers["authorization"]?.split(" ")[1];
//     return getMe(req, res, token);
//   }
// }

// module.exports = userRoutes;

const {
  register,
  login,
  updateProfile,
  getMe,
  getUsers,
  updateUserStatus,
  deleteUser,
} = require("../controllers/userController");

// Handles all user-related routes
function userRoutes(req, res, data, url) {
  // ----------------------
  // Public routes
  // ----------------------
  if (url === "/register" && req.method === "POST") return register(req, res, data);
  if (url === "/login" && req.method === "POST") return login(req, res, data);

  // ----------------------
  // Protected user routes
  // ----------------------
  if (url === "/update-profile" && req.method === "POST") return updateProfile(req, res, data);
  if (url === "/me" && req.method === "GET") {
    const token = req.headers["authorization"]?.split(" ")[1];
    return getMe(req, res, token);
  }

  // ----------------------
  // Admin routes
  // ----------------------
  if (url.startsWith("/users") && req.method === "GET") {
    const query = Object.fromEntries(new URLSearchParams(url.split("?")[1]));
    return getUsers(req, res, query);
  }

  if (url === "/users/update-status" && req.method === "POST") {
    return updateUserStatus(req, res, data);
  }

  if (url === "/users/delete" && req.method === "POST") {
    return deleteUser(req, res, data);
  }
}

module.exports = userRoutes;
