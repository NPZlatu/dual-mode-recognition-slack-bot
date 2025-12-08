import dotenv from "dotenv";
import { app, receiver } from "./slack/boltApp.js";
import githubWebhookRoute from "./hooks/gitHubWebhook.js";
import trelloWebhookRoute from "./hooks/trelloWebhook.js";
import { handleDeliveryCommand } from "./slack/api.js";
import express from "express";
import processBatchEvents from "./utils/processBatchEvents.js";
dotenv.config();

// Create an Express app
const expressApp = express();

// Parse JSON
expressApp.use(express.json());

// Custom webhook routes
expressApp.use("/github", githubWebhookRoute);
expressApp.use("/trello", trelloWebhookRoute);

// Use receiver.router for Slack events
expressApp.use("/", receiver.router);

// Slash command
app.command("/delivery", handleDeliveryCommand);

const port = process.env.PORT || 3000;
expressApp.listen(port, async () => {
  console.log(`🚀 Server is running on port ${port}`);
  await processBatchEvents();
});
