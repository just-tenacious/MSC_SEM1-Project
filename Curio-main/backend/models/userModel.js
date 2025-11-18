const { ObjectId } = require("mongodb");
const { DB_NAME, client } = require("../config/db");

const COLLECTION = "Users";

async function saveUser(data) {
  const now = new Date();
  const userDoc = {
    fullname: data.fullname || "Anonymous",
    username: data.username,
    dob: data.dob || null,
    gender: data.gender || "unspecified",
    email: data.email,
    password: data.password, // ⚠️ hash in production
    is_admin: 0,
    acc_status: 0,
    created_at: now,
    updated_at: now,
  };
  return client.db(DB_NAME).collection(COLLECTION).insertOne(userDoc);
}

async function findUser(query) {
  return client.db(DB_NAME).collection(COLLECTION).findOne(query);
}

async function updateUser(id, updates) {
  return client.db(DB_NAME).collection(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    { $set: updates }
  );
}

module.exports = { saveUser, findUser, updateUser };
