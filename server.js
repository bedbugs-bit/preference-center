import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv"; 

//cron job
import cron from 'node-cron';
import pool from "./src/db/index.js";

cron.schedule('0 0 * * *', async () => { // Runs daily at midnight
  console.log('Cleaning expired consents...');
  await pool.query('DELETE FROM events WHERE expires_at < NOW()');
});

// routes
import userRoutes from "./src/routes/userRoutes.js"
import eventRoutes from './src/routes/eventRoutes.js';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);

// Default route
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the preference Center API!");
});

// Start the server
app.listen(port, () =>{
    console.log(`Server is running on http://localhost:${port}`);
})
