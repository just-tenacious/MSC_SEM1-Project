const { ObjectId } = require("mongodb");
const { DB_NAME, client } = require("../config/db");

const COLLECTION = "height_build";

async function getHeightBuildWithUser() {
  return client.db(DB_NAME).collection(COLLECTION).aggregate([
    {
      $lookup: {
        from: "Users",
        localField: "user_id",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    { $unwind: "$userInfo" },
    {
      $project: {
        _id: 1,
        gender: 1,
        footSize: 1,
        height: 1,
        weight: 1,
        frame: 1,
        userName: "$userInfo.fullname",
      },
    },
  ]).toArray();
}

async function saveHeightBuild(data) {
  const result = await client.db(DB_NAME).collection(COLLECTION).insertOne({
    user_id:new ObjectId(data.user_id),
    gender: data.gender,
    footSize: data.footSize,
    height: data.height,
    weight: data.weight,
    frame: data.frame,
    created_at: new Date(),
    updated_at: new Date(),
  });
  return result;
}


module.exports = { getHeightBuildWithUser , saveHeightBuild };
