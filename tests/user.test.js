import request from "supertest";
import app from "../server.js";

describe("User API", () => {
  it("should create a new user", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ email: "test@example.com" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.email).toBe("test@example.com");
  });

  it("should fail to create a user with invalid email", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ email: "invalid-email" });

    expect(res.statusCode).toBe(422);
  });
});
