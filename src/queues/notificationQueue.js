import Queue from "bull";
import dotenv from "dotenv";

dotenv.config();

// Define the queue
const notificationQueue = new Queue("notifications", {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

// Process jobs
notificationQueue.process(async (job) => {
  const { email, message } = job.data;

  console.log(`Processing notification job: Sending to ${email}`);
  // Simulate notification sending (e.g., email or SMS)
  await sendNotification(email, message); // Replace with actual logic
});

// Helper function to add a job to the queue
export const addNotificationToQueue = (email, message) => {
  notificationQueue.add({
    email,
    message,
  });
};

// Placeholder for sending notification
const sendNotification = async (email, message) => {
  console.log(`Sending notification to ${email}: ${message}`);
};
