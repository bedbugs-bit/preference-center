import * as EventModel from "../models/eventModel.js";
import { addNotificationToQueue } from "../queues/notificationQueue.js";
import { logAudit } from "../services/auditService.js";

// Create a new consent change event
export const createEvent = async (req, res) => {
  const { userId, consentId, enabled } = req.body;

  if (!userId || !consentId || typeof enabled !== "boolean") {
    return res.status(422).json({ error: "Invalid request data" });
  }

  try {
    const event = await EventModel.createEvent(userId, consentId, enabled);

    // Log the action in the audit table
    await logAudit(userId, "CONSENT_UPDATED", { consentId, enabled });

    // Add a notification to the queue
    const user = await UserModel.getUserById(userId);
    const message = `Your consent for ${consentId} has been ${
      enabled ? "enabled" : "disabled"
    }.`;
    addNotificationToQueue(user.email, message);

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};

// Get all events for a user
export const getEventsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const events = await EventModel.getEventsByUserId(userId);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};

// Get the current consent state for a user
export const getUserConsentState = async (req, res) => {
  const { userId } = req.params;

  try {
    const consentState = await EventModel.getUserConsentState(userId);
    res.status(200).json(consentState);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};

export const getFilteredEvents = async (req, res) => {
  const { userId } = req.params;
  const { consentId } = req.query;

  try {
    const events = await EventModel.getFilteredEvents(userId, consentId);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};
