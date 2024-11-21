import * as EventModel from "../models/eventModel.js";
import * as UserModel from "../models/userModel.js";
import { addNotificationToQueue } from "../queues/notificationQueue.js";
import { logAudit } from "../services/auditService.js";
import { notifyConsentUpdate } from "../../server.js";
import logger from "../utils/logger.js";

// verify that the Redis server is running
// import redisClient from "../utils/redisClient.js";

/**
 * Create a new consent change event
 */
export const createEvent = async (req, res) => {
  const { userId, consentId, enabled } = req.body;

  if (!userId || !consentId || typeof enabled !== "boolean") {
    return res.status(422).json({ error: "Invalid request data" });
  }

  try {
    // Create the event in the database
    const event = await EventModel.createEvent(userId, consentId, enabled);

    // Log the action in the audit table
    try {
      await logAudit(userId, "CONSENT_UPDATED", { consentId, enabled });
    } catch (auditError) {
      logger.error(
        `Failed to log audit for user ${userId}: ${auditError.message}`
      );
    }

    // Add a notification to the queue
    const user = await UserModel.getUserById(userId);
    if (user) {
      const message = `Your consent for ${consentId} has been ${
        enabled ? "enabled" : "disabled"
      }.`;
      addNotificationToQueue(user.email, message);

      // Real-time notification
      notifyConsentUpdate(userId, consentId, enabled);
    } else {
      logger.warn(`User not found for ID ${userId}. Skipping notification.`);
    }

    logger.info(
      `Consent updated: User ${userId}, Consent ${consentId}, Enabled ${enabled}`
    );

    res.status(201).json(event);
  } catch (error) {
    logger.error(`Error updating consent for user ${userId}: ${error.message}`);
    res.status(500).json({ error: "Database error" });
  }
};

/**
 * Get all events for a user
 */
export const getEventsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const events = await EventModel.getEventsByUserId(userId);
    res.status(200).json(events);
  } catch (error) {
    logger.error(`Error fetching events for user ${userId}: ${error.message}`);
    res.status(500).json({ error: "Database error" });
  }
};

/**
 * Get the current consent state for a user
 */
export const getUserConsentState = async (req, res) => {
  const { userId } = req.params;

  try {
    const consentState = await EventModel.getUserConsentState(userId);
    res.status(200).json(consentState);
  } catch (error) {
    logger.error(
      `Error fetching consent state for user ${userId}: ${error.message}`
    );
    res.status(500).json({ error: "Database error" });
  }
};

// export const getUserConsentState = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     // Check Redis cache
//     const cachedState = await redisClient.get(`user:${userId}:consentState`);
//     if (cachedState) {
//       logger.info(`Cache hit for user ${userId}`);
//       return res.status(200).json(JSON.parse(cachedState));
//     }

//     // Fetch from database
//     const consentState = await EventModel.getUserConsentState(userId);

//     // Cache the result
//     await redisClient.set(
//       `user:${userId}:consentState`,
//       JSON.stringify(consentState),
//       { EX: 60 * 10 } // Cache for 10 minutes
//     );

//     res.status(200).json(consentState);
//   } catch (error) {
//     logger.error(
//       `Error fetching consent state for user ${userId}: ${error.message}`
//     );
//     res.status(500).json({ error: "Database error" });
//   }
// };

/**
 * Get filtered events for a user
 */
export const getFilteredEvents = async (req, res) => {
  const { userId } = req.params;
  const { consentId } = req.query;

  try {
    const events = await EventModel.getFilteredEvents(userId, consentId);
    res.status(200).json(events);
  } catch (error) {
    logger.error(
      `Error fetching filtered events for user ${userId} with consentId ${consentId}: ${error.message}`
    );
    res.status(500).json({ error: "Database error" });
  }
};
