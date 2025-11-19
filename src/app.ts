import dotenv from "dotenv";
import { app, receiver } from "./slack/boltApp.js";
import githubWebhookRoute from "./hooks/gitHubWebhook.js";
import trelloWebhookRoute from "./hooks/trelloWebhook.js";
import express from "express";
import processBatchEvents from "./utils/processBatchEvents.js";
dotenv.config();

// Allow parsing of JSON bodies for incoming webhooks
receiver.router.use(express.json());

// Mount the GitHub webhook route
receiver.router.use("/", githubWebhookRoute);
// Mount the Trello webhook route
receiver.router.use("/", trelloWebhookRoute);

// Start the Slack Bolt app
const startApp = async () => {
  const port = process.env.PORT || 3000;
  await app.start(port);
  console.log(`⚡️ Bolt app is running on port ${port}`);
  // Start processing batch events
  await processBatchEvents();
};

startApp();
