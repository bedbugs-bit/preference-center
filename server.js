import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";    

// routes
import userRoutes from "./src/routes/userRoutes.js"

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/api", userRoutes);

// Default route
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the preference Center API!");
});

// Start the server
app.listen(port, () =>{
    console.log(`Server is running on http://localhost:${port}`);
})
