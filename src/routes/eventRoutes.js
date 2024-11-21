import express from "express";
import * as EventController from "../controllers/eventController.js";

const router = express.Router();

// Routes
router.post("/", EventController.createEvent);
router.get("/:userId", EventController.getEventsByUserId);
router.get("/:userId/state", EventController.getUserConsentState);

export default router;
