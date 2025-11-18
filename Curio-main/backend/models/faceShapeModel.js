const { ObjectId } = require("mongodb");
const { DB_NAME, client } = require("../config/db");

const COLLECTION = "face_shape";

async function saveFaceShape(data) {
  const now = new Date();
  const doc = {
    user_id: new ObjectId(data.user_id),
    faceLength: data.faceLength,
    foreheadWidth: data.foreheadWidth,
    cheekboneWidth: data.cheekboneWidth,
    jawlineWidth: data.jawlineWidth,
    face_shape: data.face_shape,
    created_at: now,
    updated_at: now,
  };
  return client.db(DB_NAME).collection(COLLECTION).insertOne(doc);
}

async function getFaceShapesWithUser() {
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
        faceLength: 1,
        foreheadWidth: 1,
        cheekboneWidth: 1,
        jawlineWidth: 1,
        face_shape: 1,
        userName: "$userInfo.fullname",
        gender: "$userInfo.gender",
      },
    },
  ]).toArray();
}

module.exports = { saveFaceShape, getFaceShapesWithUser };