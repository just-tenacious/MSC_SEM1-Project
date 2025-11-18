const { client } = require("../config/db");

const getCollectionCounts = async () => {
  const db = client.db(); // Use default DB from connection URI

  const usersCollection = db.collection("users");
//   const adminRequestsCollection = db.collection("adminrequests");
//   const faceViewCollection = db.collection("faceviews");
//   const bodyViewCollection = db.collection("bodyviews");
//   const heightBuildCollection = db.collection("heightbuilds");
  const recommendationsCollection = db.collection("recommendations");
//   const reportsCollection = db.collection("reports");
  const contactCollection = db.collection("contacts");

  const [
    users,
    blockedUsers,
    admins,
    adminRequests,
    faceView,
    bodyView,
    heightBuild,
    recommendations,
    reports,
    contact,
  ] = await Promise.all([
    usersCollection.countDocuments({}),
    usersCollection.countDocuments({ isBlocked: true }),
    usersCollection.countDocuments({ role: "admin" }),
    // adminRequestsCollection.countDocuments({ status: "pending" }),
    // faceViewCollection.countDocuments({}),
    // bodyViewCollection.countDocuments({}),
    // heightBuildCollection.countDocuments({}),
    recommendationsCollection.countDocuments({}),
    // reportsCollection.countDocuments({}),
    contactCollection.countDocuments({}),
  ]);

  return {
    users,
    blockedUsers,
    admins,
    adminRequests,
    // faceView,
    // bodyView,
    // heightBuild,
    recommendations,
    // reports,
    contact,
  };
};

module.exports = { getCollectionCounts };
