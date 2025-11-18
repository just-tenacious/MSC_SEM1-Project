const { saveUser, findUser, updateUser } = require("../models/userModel");
const { generateToken, verifyToken } = require("../utils/auth");
const { ObjectId } = require("mongodb");
const { DB_NAME, client } = require("../config/db");

// Helper to send JSON responses
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

// =======================
// User Auth & Profile
// =======================

// Register new user
async function register(req, res, data) {
  try {
    await saveUser(data);
    sendJson(res, 201, {
      status: "ok",
      message: "User registered successfully",
    });
  } catch (err) {
    sendJson(res, 500, { error: err.message });
  }
}

// Login user

async function login(req, res, data) {
  try {
    const user = await findUser({
      $or: [
        { email: data.emailOrUsername },
        { username: data.emailOrUsername },
      ],
    });

    if (!user || user.password !== data.password) {
      return sendJson(res, 401, { error: "Invalid credentials" });
    }

    // Check account status
    if (user.acc_status === 2) {
      return sendJson(res, 403, { error: "User is blocked" });
    }

    // if (user.acc_status === 0) {
    //   return sendJson(res, 200, { status: "otp_required", user: { email: user.email, username: user.username } });
    // }

    if (user.acc_status === 0) {
      return sendJson(res, 200, {
        status: "otp_required",
        user: {
          id: user._id, // include this
          email: user.email,
          username: user.username,
          acc_status: user.acc_status, // include this
        },
      });
    }

    // If acc_status is 1, allow login
    const token = generateToken(user);
    sendJson(res, 200, { status: "ok", token, user });
  } catch (err) {
    sendJson(res, 500, { error: err.message });
  }
}

// Update user profile
async function updateProfile(req, res, data) {
  try {
    const user = await client
      .db(DB_NAME)
      .collection("Users")
      .findOne({ _id: new ObjectId(data._id) });
    if (!user) return sendJson(res, 404, { error: "User not found" });
    if (user.is_admin === 1)
      return sendJson(res, 403, { error: "Cannot edit admin" });

    const updates = {
      fullname: data.fullname,
      username: data.username,
      dob: data.dob,
      gender: data.gender,
      updated_at: new Date(),
    };
    if (data.password?.trim()) updates.password = data.password;

    await updateUser(data._id, updates);
    const updatedUser = await findUser({ _id: new ObjectId(data._id) });
    const token = generateToken(updatedUser);

    sendJson(res, 200, { status: "ok", user: updatedUser, token });
  } catch (err) {
    sendJson(res, 400, { error: err.message });
  }
}



// Get current user info
async function getMe(req, res, token) {
  try {
    const decoded = verifyToken(token);

    const user = await client
      .db(DB_NAME)
      .collection("Users")
      .findOne(
        { _id: new ObjectId(decoded.id) },
        { projection: { password: 0 } }
      );

    if (!user) return sendJson(res, 404, { error: "User not found" });

    sendJson(res, 200, { status: "ok", user });
  } catch (err) {
    sendJson(res, 401, { error: "Invalid or expired token" });
  }
}

// =======================
// Admin User Management
// =======================

// Get users list (non-admins only)

async function getUsers(req, res, query) {
  try {
    const filter = {};

    // Parse query params (example: ?is_admin=2&acc_status=1)
    if (query.is_admin !== undefined)
      filter.is_admin = parseInt(query.is_admin);
    if (query.acc_status !== undefined)
      filter.acc_status = parseInt(query.acc_status);

    const users = await client
      .db(DB_NAME)
      .collection("Users")
      .find(filter, { projection: { password: 0 } })
      .sort({ created_at: -1 })
      .toArray();

    const formatted = users.map((u, index) => ({
      id: index + 1,
      _id: u._id,
      fullname: u.fullname,
      username: u.username,
      email: u.email,
      is_admin: u.is_admin,
      acc_status: u.acc_status,
      createdAt: u.created_at || u.createdAt || new Date(),
      updatedAt: u.updated_at || null,
    }));

    sendJson(res, 200, formatted);
  } catch (err) {
    console.error("❌ getUsers error:", err);
    sendJson(res, 500, { error: err.message });
  }
}

// Block / Unblock user
// async function updateUserStatus(req, res, data) {
//   try {
//     const user = await client.db(DB_NAME).collection("Users").findOne({ _id: new ObjectId(data._id) });
//     if (!user) return sendJson(res, 404, { error: "User not found" });
//     if (user.is_admin === 1) return sendJson(res, 403, { error: "Cannot modify admin" });

//     await updateUser(data._id, { acc_status: data.status, updated_at: new Date() });
//     sendJson(res, 200, { status: "ok" });
//   } catch (err) {
//     sendJson(res, 500, { error: err.message });
//   }
// }

// Approve / reject admin requests or block/unblock normal users
async function updateUserStatus(req, res, data) {
  try {
    const user = await client
      .db(DB_NAME)
      .collection("Users")
      .findOne({ _id: new ObjectId(data._id) });
    if (!user) return sendJson(res, 404, { error: "User not found" });

    const updates = { updated_at: new Date() };

    // If the user is a pending admin (is_admin = 1) and status = 2 → approve
    if (user.is_admin === 1 && data.status === 2) {
      updates.is_admin = 2; // approved admin
      updates.acc_status = 1; // active
    } else {
      // For normal users or admin rejection/block
      updates.acc_status = data.status;
    }

    await updateUser(data._id, updates);
    sendJson(res, 200, { status: "ok" });
  } catch (err) {
    sendJson(res, 500, { error: err.message });
  }
}

// Delete user
// async function deleteUser(req, res, data) {
//   try {
//     const user = await client.db(DB_NAME).collection("Users").findOne({ _id: new ObjectId(data._id) });
//     if (!user) return sendJson(res, 404, { error: "User not found" });
//     if (user.is_admin === 1) return sendJson(res, 403, { error: "Cannot delete admin" });

//     await client.db(DB_NAME).collection("Users").deleteOne({ _id: new ObjectId(data._id) });
//     sendJson(res, 200, { status: "ok" });
//   } catch (err) {
//     sendJson(res, 500, { error: err.message });
//   }
// }

// Reject admin request or delete normal user
async function deleteUser(req, res, data) {
  try {
    const user = await client
      .db(DB_NAME)
      .collection("Users")
      .findOne({ _id: new ObjectId(data._id) });
    if (!user) return sendJson(res, 404, { error: "User not found" });

    if (user.is_admin === 1) {
      // Reject admin request instead of deleting
      await updateUser(data._id, { acc_status: 0, updated_at: new Date() });
      return sendJson(res, 200, {
        status: "ok",
        message: "Admin request rejected",
      });
    }

    // Normal user deletion
    await client
      .db(DB_NAME)
      .collection("Users")
      .deleteOne({ _id: new ObjectId(data._id) });
    sendJson(res, 200, { status: "ok" });
  } catch (err) {
    sendJson(res, 500, { error: err.message });
  }
}

async function getSubUsers(req, res, query) {
  try {
    const filter = {};

    // Filter by status
    switch (query.type) {
      case "active":
        filter.acc_status = 1;
        filter.is_admin = { $ne: 2 };
        break;
      case "blocked":
        filter.acc_status = 2;
        break;
      case "unverified":
        filter.acc_status = 0;
        break;
      case "all":
      default:
        break;
    }

    const users = await client
      .db(DB_NAME)
      .collection("Users")
      .find(filter, { projection: { password: 0 } })
      .sort({ created_at: -1 })
      .toArray();

    const formatted = users.map((u, index) => ({
      id: index + 1,
      _id: u._id,
      fullname: u.fullname,
      username: u.username,
      email: u.email,
      is_admin: u.is_admin,
      acc_status: u.acc_status,
      createdAt: u.created_at || u.createdAt || new Date(),
      updatedAt: u.updated_at || null,
    }));

    sendJson(res, 200, formatted);
  } catch (err) {
    console.error("❌ getSubUsers error:", err);
    sendJson(res, 500, { error: err.message });
  }
}

// Update status of sub-users or admin requests
async function updateUserStatus(req, res, data) {
  try {
    const user = await client
      .db(DB_NAME)
      .collection("Users")
      .findOne({ _id: new ObjectId(data._id) });

    if (!user) return sendJson(res, 404, { error: "User not found" });

    const updates = { updated_at: new Date() };

    // Approve pending admin
    if (user.is_admin === 1 && data.status === 2) {
      updates.is_admin = 2;
      updates.acc_status = 1;
    } else {
      // Normal user block/unblock or admin rejection
      updates.acc_status = data.status;
    }

    await updateUser(data._id, updates);
    sendJson(res, 200, { status: "ok" });
  } catch (err) {
    sendJson(res, 500, { error: err.message });
  }
}

// Delete user or reject admin request
async function deleteUser(req, res, data) {
  try {
    const user = await client
      .db(DB_NAME)
      .collection("Users")
      .findOne({ _id: new ObjectId(data._id) });

    if (!user) return sendJson(res, 404, { error: "User not found" });

    if (user.is_admin === 1) {
      // Reject admin request
      await updateUser(data._id, { acc_status: 0, updated_at: new Date() });
      return sendJson(res, 200, {
        status: "ok",
        message: "Admin request rejected",
      });
    }

    // Delete normal user
    await client
      .db(DB_NAME)
      .collection("Users")
      .deleteOne({ _id: new ObjectId(data._id) });

    sendJson(res, 200, { status: "ok" });
  } catch (err) {
    sendJson(res, 500, { error: err.message });
  }
}

// =======================
// Export all
// =======================
module.exports = {
  register,
  login,
  updateProfile,
  getMe,
  getUsers,
  updateUserStatus,
  deleteUser,
};
