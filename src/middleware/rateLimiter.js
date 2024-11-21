import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  message: "We've capped your requests, try again later",
});
