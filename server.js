import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
import { register, httpRequestDuration } from "./src/utils/metrics.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import { requestLogger } from "./src/middleware/requestLogger.js";

// import helmet to secure headers
import helmet from "helmet";

// import the api limiter
import { apiLimiter } from "./src/middleware/rateLimiter.js";

// cron job
import cron from "node-cron";
import pool from "./src/db/index.js";

// routes
import userRoutes from "./src/routes/userRoutes.js";
import eventRoutes from "./src/routes/eventRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(helmet()); //  helmet middleware to secure headers
app.use(requestLogger); // Request logger middleware to log all requests

// Error handler is the last middleware
app.use(errorHandler);

// Routes
app.use("/api/users", userRoutes, apiLimiter);
app.use("/api/events", eventRoutes, apiLimiter);

// Default route
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the preference Center API!");
});

// Metrics
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on("finish", () => {
    end({
      method: req.method,
      route: req.route?.path || req.path,
      status_code: res.statusCode,
    });
  });
  next();
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// Create a http server
const server = http.createServer(app);

// Create a new instance of socket.io by passing the http server object
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("A user connected.");

  socket.on("disconnect", () => {
    console.log("User disconnected.");
  });
});

// Broadcast consent updates
export const notifyConsentUpdate = (userId, consentId, enabled) => {
  io.emit("consent_update", { userId, consentId, enabled });
};

// Cron scheduler
cron.schedule("0 0 * * *", async () => {
  // Runs daily at midnight
  console.log("Cleaning expired consents...");
  await pool.query("DELETE FROM events WHERE expires_at < NOW()");
});

// Start the server only when not in a test environment
// Jest tries to run tests in parallel, and each test file attempts to start
// the server on the same port (3000).
// Solution: Use supertest without explicitly starting the server

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

export default app;
