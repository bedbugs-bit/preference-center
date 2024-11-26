import * as UserModel from "../models/userModel.js";
import pool from "../db/index.js";

// create a new user
export const createUser = async (req, res) => {
  const { email } = req.body;

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(422).json({ error: "Invalid email address" });
  }

  try {
    const user = await UserModel.createUser(email);
    res.status(201).json(user);
  } catch (error) {
    if (error.code === "23505") {
      res.status(409).json({ error: "Email already exists" });
    } else {
      res.status(500).json({ error: "Database error" });
    }
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};

// Get a user by ID
export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserModel.getUserById(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};

// Update a user's email
export const updateUserEmail = async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(422).json({ error: "Invalid email address" });
  }

  try {
    // Check if the email already exists
    const emailCheck = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );
    if (emailCheck.rowCount > 0) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const user = await UserModel.updateUserEmail(id, email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "Email updated successfully", user });
  } catch (error) {
    console.error(error);
    if (error.code === "23505") {
      res.status(409).json({ error: "Email already exists" });
    } else {
      res.status(500).json({ error: "Database error" });
    }
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.deleteUser(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};
