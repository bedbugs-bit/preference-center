import request from "supertest";
import app from "../server.js";
import pool from "../src/db/index.js";

let userId;

// Helper to generate unique email addresses
const generateUniqueEmail = () => `test_${Date.now()}@example.com`;

describe("User API", () => {
  afterEach(async () => {
    if (userId) {
      await pool.query("DELETE FROM users WHERE id = $1", [userId]); // Delete the user
      userId = null;
    }
  });

  it("should create a new user", async () => {
    const uniqueEmail = generateUniqueEmail(); // Generate a unique email
    const res = await request(app)
      .post("/api/users")
      .send({ email: uniqueEmail });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.email).toBe(uniqueEmail);

    userId = res.body.id; // Save the user ID for cleanup
  });

  it("should fail to create a user with invalid email", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ email: "invalid-email" });

    expect(res.statusCode).toBe(422);
  });
});

afterAll(async () => {
  await pool.end(); // Close the database connection
});
