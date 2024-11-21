import { json } from "body-parser";
import pool from "../db/index.js";

export const logAudit = async (userId, action, details) => {
  try {
    await pool.query(
      "INSERT INTO audit_logs (user_id, action, details) VALUES ($1, $2, $3)",
      [userId, action, json.stringify(details)]
    );
  } catch (error) {
    console.error("Error logging audit", error);
  }
};
