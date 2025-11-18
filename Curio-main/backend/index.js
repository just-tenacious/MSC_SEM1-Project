
const http = require("http");

const { connectDB, client } = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const contactRoutes = require("./routes/contactRoutes");
const styleRoutes = require("./routes/styleRoutes");
const analysisRoutes = require("./routes/analysisRoutes"); 
const recommendationRoutes = require("./routes/recommendationRoutes");
const otpRoutes = require("./routes/otpRoutes");
const adminCountsRoute = require("./routes/adminCountsRoute");

const MAX_BODY_SIZE = 1e6;

const port = process.env.PORT || 3001;

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  // res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(204).end();
    return;
  }

  let body = "";
  let aborted = false;

  req.on("data", chunk => {
    body += chunk;
    if (body.length > MAX_BODY_SIZE) {
      if (!res.headersSent) {
        res.writeHead(413, { "Content-Type": "application/json" }).end(
          JSON.stringify({ error: "Payload too large" })
        );
      }
      aborted = true;
      req.destroy();
      return;
    }
  });

  req.on("end", async () => {
    if (aborted) return; // stop if already sent response

    try {
      const data = body ? JSON.parse(body) : {};
      const url = req.url.toLowerCase();

      // Routes: each route should return true ONLY if it sends a response
      if (await contactRoutes(req, res, data, url)) return;
      if (await userRoutes(req, res, data, url)) return;
      if (await styleRoutes(req, res, url)) return;
      if (await analysisRoutes(req, res, data, url)) return;  
      if (await recommendationRoutes(req, res, data, url)) return;
      if( await otpRoutes(req , res , data , url) ) return;  
      if( await adminCountsRoute(req , res , data , url) ) return;

      // fallback 404
      if (!res.headersSent) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Not found" }));
      }
    } catch (err) {
      console.error("Server error:", err);
      if (!res.headersSent) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
      }
    }
  });

  // Handle unexpected errors
  req.on("error", (err) => {
    console.error("Request error:", err);
    if (!res.headersSent) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Bad Request" }));
    }
  });
});

// Connect MongoDB and start server
connectDB().then(() => {
  server.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:`,port);
  });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("🛑 Closing MongoDB connection...");
  await client.close();
  process.exit(0);
});
