import pool from '../db/index.js';

// Create a new event
export const createEvent = async (userId, consentId, enabled) => {
  const result = await pool.query(
    'INSERT INTO events (user_id, consent_id, enabled) VALUES ($1, $2, $3) RETURNING *',
    [userId, consentId, enabled]
  );
  return result.rows[0];
};

// Get all events for a user
export const getEventsByUserId = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM events WHERE user_id = $1 ORDER BY created_at ASC',
    [userId]
  );
  return result.rows;
};

// Get the latest consent state for a user
export const getUserConsentState = async (userId) => {
  const result = await pool.query(
    `SELECT consent_id, enabled
     FROM events
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );
  const consentState = {};
  result.rows.forEach((row) => {
    consentState[row.consent_id] = row.enabled;
  });
  return consentState;
};

export const getFilteredEvents = async (userId, consentId) => {
  const query = `
    SELECT * FROM events
    WHERE user_id = $1 AND consent_id = $2
    ORDER BY created_at ASC
  `;
  const result = await pool.query(query, [userId, consentId]);
  return result.rows;
};

