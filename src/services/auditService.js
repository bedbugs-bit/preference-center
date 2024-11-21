import pool from "../db/index.js";
import logger from "../utils/logger.js";

/**
 * Logs an audit action in the database.
 *
 * @param {number} userId - The ID of the user who triggered the action.
 * @param {string} action - The type of action performed (e.g., "CONSENT_UPDATED").
 * @param {object} details - Additional details about the action (will be stored as JSON).
 */

export const logAudit = async (userId, action, details) => {
  try {
    // Insert an audit log into the database
    await pool.query(
      "INSERT INTO audit_logs (user_id, action, details) VALUES ($1, $2, $3)",
      [userId, action, JSON.stringify(details)] // Serialize details object into JSON
    );

    logger.info(
      `Audit logged successfully: User ${userId}, Action: ${action}, Details: ${JSON.stringify(
        details
      )}`
    );
  } catch (error) {
    logger.error(`Error logging audit: ${error.message}`);
    throw error; // Rethrow to allow handling at the controller level
  }
};
