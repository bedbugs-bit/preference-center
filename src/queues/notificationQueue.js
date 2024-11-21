import Queue from "bull";
import dotenv from "dotenv";

dotenv.config();

const notificationQueue = new Queue("notifications", {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

// Process jobs
notificationQueue.process(async (job) => {
  const { email, message } = job.data;
  console.log(`Sending notification to ${email}: ${message}`);
});

export const addNotificationToQueue = (email, message) => {
  notificationQueue.add({ email, message });
};
