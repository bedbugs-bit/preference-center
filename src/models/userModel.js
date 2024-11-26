import pool from "../db/index.js";

// Create a new user
export const createUser = async (email) => {
  try {
    const result = await pool.query(
      "INSERT INTO users (email) VALUES ($1) RETURNING *",
      [email]
    );
    return result.rows[0];
  } catch (error) {
    console.error(`Error creating the user with email ${email}`, error);
    return null;
  }
};

// Get all users
export const getAllUsers = async () => {
  try {
    const result = await pool.query("SELECT * FROM users");
    return result.rows;
  } catch (error) {
    console.error("Error getting all users", error);
    return null;
  }
};

// Get a user by ID
export const getUserById = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0];
  } catch (error) {
    console.error(`Error getting the user with id ${id}`, error);
    return null;
  }
};

// Update a user's email
export const updateUserEmail = async (id, email) => {
  try {
    const result = await pool.query(
      "UPDATE users SET email = $1 WHERE id = $2 RETURNING *",
      [email, id]
    );
    return result.rows[0];
  } catch (error) {
    console.error(`Error updating the user with id ${id}`, error);
    throw error;
  }
};

// Delete a user
export const deleteUser = async (id) => {
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
  } catch (error) {
    console.error(`Error deleting the user with id ${id}`, error);
    return null;
  }
};
