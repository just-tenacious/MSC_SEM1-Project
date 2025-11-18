const { ObjectId } = require("mongodb");
const { DB_NAME, client } = require("../config/db");

const COLLECTION = "body_type";

async function getBodyTypesWithUser() {
  return client.db(DB_NAME).collection(COLLECTION).aggregate([
    {
      $lookup: {
        from: "Users",          // make sure this matches your users collection
        localField: "user_id",
        foreignField: "_id",
        as: "userInfo"
      }
    },
    { $unwind: "$userInfo" },  // flatten array
    {
      $project: {
        _id: 1,
        gender: 1,
        shoulderWidth: 1,
        bust: 1,
        waist: 1,
        hips: 1,
        body_shape: 1,
        userName: "$userInfo.fullname"
      }
    }
  ]).toArray();
}

async function saveBodyType(data) {
  const bodyTypeDoc = {
    user_id:new ObjectId(data.user_id),
    gender: data.gender,
    shoulderWidth: data.shoulderWidth,
    bust: data.bust,
    waist: data.waist,
    hips: data.hips,
    body_shape: data.body_shape,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const result = await client.db(DB_NAME).collection(COLLECTION).insertOne(bodyTypeDoc);
  return result;
}

module.exports = { getBodyTypesWithUser , saveBodyType };