import dotenv from "dotenv";
import { app, receiver } from "../slack/boltApp.js";
import githubWebhookRoute from "../routes/gitHubWebhook.js";
import express from "express";

dotenv.config();

// Allow parsing of JSON bodies for incoming webhooks
receiver.router.use(express.json());

// Mount the GitHub webhook route
receiver.router.use("/", githubWebhookRoute);

// Start the Slack Bolt app
const startApp = async () => {
  const port = process.env.PORT || 3000;
  await app.start(port);
  console.log(`⚡️ Bolt app is running on port ${port}`);
};

startApp();
