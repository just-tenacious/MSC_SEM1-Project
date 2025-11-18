const { client, DB_NAME } = require("../config/db");

async function adminCountsRoute(req, res, data, url) {
  const path = url.split("?")[0].replace(/\/+$/, "");
  if (path !== "/admin-counts") return false;

  if (req.method !== "GET") {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "error", message: "Method not allowed" }));
    return true;
  }

  try {
    const db = client.db(DB_NAME);

    // Total counts
    const users = await db.collection("Users").countDocuments({});
    const blockedUsers = await db.collection("Users").countDocuments({ acc_status: 2 });
    const admins = await db.collection("Users").countDocuments({ is_admin: 2 });
    const adminRequests = await db.collection("Users").countDocuments({ is_admin: 1 });
    const faceView = await db.collection("face_shape").countDocuments({});
    const bodyView = await db.collection("body_type").countDocuments({});
    const heightBuild = await db.collection("height_build").countDocuments({});
    const recommendations = await db.collection("recommendation_master").countDocuments({});
    const contact = await db.collection("Contact").countDocuments({});

    // Gender counts
    const maleUsers = await db.collection("Users").countDocuments({ gender: "male" });
    const femaleUsers = await db.collection("Users").countDocuments({ gender: "female" });

    // Status counts
    const registeredUsers = await db.collection("Users").countDocuments({ acc_status: 0 });
    const verifiedUsers = await db.collection("Users").countDocuments({ acc_status: 1 });

    // Categories for body shape and height frame
    const faceShapes = await db.collection("face_shape").distinct("face_shape");
    const bodyTypes = await db.collection("body_type").distinct("body_shape");
    const heightBuilds = await db.collection("height_build").distinct("frame");

    const faceShapeData = await db.collection("face_shape").aggregate([
      {
        $lookup: {
          from: "Users",
          localField: "user_id",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          face_shape: 1,
          gender: "$userInfo.gender"
        }
      }
    ]).toArray();

    const faceCounts = {};
    const faceCountsMale = {};
    const faceCountsFemale = {};

    for (const shape of faceShapes) {
      faceCounts[shape] = 0;
      faceCountsMale[shape] = 0;
      faceCountsFemale[shape] = 0;
    }

    for (const item of faceShapeData) {
      const shape = item.face_shape;
      if (!shape) continue;

      faceCounts[shape]++;

      if (item.gender === "male") faceCountsMale[shape]++;
      if (item.gender === "female") faceCountsFemale[shape]++;
    }

    const bodyCountsMale = {};
    const bodyCountsFemale = {};
    const heightCountsMale = {};
    const heightCountsFemale = {};

    for (const type of bodyTypes) {
      bodyCountsMale[type] = await db.collection("body_type")
        .countDocuments({ body_shape: type, gender: { $regex: /^male$/i } });
      bodyCountsFemale[type] = await db.collection("body_type")
        .countDocuments({ body_shape: type, gender: { $regex: /^female$/i } });
    }

    for (const build of heightBuilds) {
      heightCountsMale[build] = await db.collection("height_build")
        .countDocuments({ frame: build, gender: { $regex: /^male$/i } });
      heightCountsFemale[build] = await db.collection("height_build")
        .countDocuments({ frame: build, gender: { $regex: /^female$/i } });
    }

    const bodyCounts = {};
    const heightCounts = {};

    for (const type of bodyTypes) {
      bodyCounts[type] = bodyCountsMale[type] + bodyCountsFemale[type];
    }
    for (const build of heightBuilds) {
      heightCounts[build] = heightCountsMale[build] + heightCountsFemale[build];
    }

    const counts = {
      users,
      blockedUsers,
      admins,
      adminRequests,
      faceView,
      bodyView,
      heightBuild,
      recommendations,
      contact,
      reports: 0,
      genderCounts: { male: maleUsers, female: femaleUsers },
      statusCounts: { registered: registeredUsers, verified: verifiedUsers, blocked: blockedUsers },
      
      faceCounts,
      faceCountsMale,
      faceCountsFemale,

      bodyCounts,
      bodyCountsMale,
      bodyCountsFemale,

      heightCounts,
      heightCountsMale,
      heightCountsFemale,
    };

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", counts }));

    return true;

  } catch (err) {
    console.error("Failed to fetch admin counts:", err);
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "error", message: "Failed to fetch counts" }));
    }
    return true;
  }
}

module.exports = adminCountsRoute;
