import request from "supertest";
import app from "../server.js";
import pool from "../src/db/index.js";

// Helper to generate unique email addresses
const generateUniqueEmail = () => `user_${Date.now()}@example.com`;

let userId;
let eventId;

describe("Event API", () => {
  beforeEach(async () => {
    const uniqueEmail = generateUniqueEmail(); // Generate a unique email
    const userRes = await request(app)
      .post("/api/users")
      .send({ email: uniqueEmail });
    userId = userRes.body.id; // Save the created user ID
  });

  afterEach(async () => {
    if (eventId) {
      await pool.query("DELETE FROM events WHERE id = $1", [eventId]); // Delete the event
      eventId = null;
    }

    if (userId) {
      await pool.query("DELETE FROM users WHERE id = $1", [userId]); // Delete the user
      userId = null;
    }
  });

  it("should create a new event for a user", async () => {
    const eventRes = await request(app).post("/api/events").send({
      userId,
      consentId: "email_notifications",
      enabled: true,
    });

    expect(eventRes.statusCode).toBe(201);
    expect(eventRes.body).toHaveProperty("id");
    expect(eventRes.body.consent_id).toBe("email_notifications");

    eventId = eventRes.body.id; // Save the created event ID for cleanup
  });

  it("should fail to create an event with invalid data", async () => {
    const eventRes = await request(app).post("/api/events").send({
      userId: null, // Invalid data
      consentId: "email_notifications",
      enabled: true,
    });

    expect(eventRes.statusCode).toBe(422);
  });
});

afterAll(async () => {
  await pool.end(); // Close the database connection
});
