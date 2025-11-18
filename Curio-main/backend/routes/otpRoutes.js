require("dotenv").config(); // Must be at the top

// otpRoutes.js
const nodemailer = require("nodemailer");
const { MongoClient } = require("mongodb");

// ------------------- CONFIG -------------------
const uri = process.env.MONGO_URI; // "mongodb://localhost:27017/curio"
const dbName = "curio";

// In-memory OTP store
const otpStore = {};

// ------------------- MONGODB CLIENT -------------------
let db;
async function initDb() {
  const client = new MongoClient(uri);
  await client.connect();
  console.log("✅ Connected to MongoDB");
  db = client.db(dbName);
}

// Initialize DB connection immediately
initDb().catch((err) => console.error("❌ MongoDB connection error:", err));

// ------------------- NODEMAILER -------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App password, no spaces
  },
});

// Optional: verify transporter
transporter.verify((err, success) => {
  if (err) console.error("❌ SMTP Error:", err);
  else console.log("✅ SMTP ready to send emails");
});

// ------------------- OTP ROUTES -------------------
async function otpRoutes(req, res, data, url) {
  // ---------------- SEND OTP ----------------
  if (url === "/api/send-otp" && req.method === "POST") {
    const { email } = data;

    if (!email) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "Email is required" }));
      return true;
    }

    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Clear previous OTP
      if (otpStore[email]) clearTimeout(otpStore[email].timer);

      const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
      const timer = setTimeout(() => delete otpStore[email], 5 * 60 * 1000);

      otpStore[email] = { otp, expiresAt, timer };

      console.log(`📩 OTP for ${email}: ${otp}`);

      // Send email
      try {
        await transporter.sendMail({
          from: `"Curio App" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Your Curio OTP Code",
          text: `Your OTP code is ${otp}. It expires in 5 minutes.`,
        });
      } catch (emailErr) {
        console.error("❌ Failed to send email:", emailErr);
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, message: "OTP sent! Check email or console." }));
      return true;
    } catch (err) {
      console.error("❌ Error sending OTP:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "Failed to send OTP" }));
      return true;
    }
  }

  // ---------------- VERIFY OTP ----------------
  if (url === "/api/verify-otp" && req.method === "POST") {
    const { email, otp } = data;

    if (!email || !otp) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "Email and OTP required" }));
      return true;
    }

    const record = otpStore[email];
    if (!record) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "OTP not found or expired" }));
      return true;
    }

    if (Date.now() > record.expiresAt) {
      clearTimeout(record.timer);
      delete otpStore[email];
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "OTP expired" }));
      return true;
    }

    if (record.otp !== otp) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "Invalid OTP" }));
      return true;
    }

    // ✅ OTP valid
    clearTimeout(record.timer);
    delete otpStore[email];

    try {
      const usersCollection = db.collection("Users");

      const result = await usersCollection.updateOne(
        { email },
        { $set: { acc_status: 1 } }
      );

      if (result.matchedCount === 0) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "User not found" }));
        return true;
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, message: "OTP verified! Account activated." }));
      return true;
    } catch (dbErr) {
      console.error("❌ Error updating user:", dbErr);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "Server error" }));
      return true;
    }
  }

  return false;
}

module.exports = otpRoutes;
