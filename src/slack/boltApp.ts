import Bolt from "@slack/bolt";
const { App, ExpressReceiver } = Bolt;

import dotenv from "dotenv";

dotenv.config();

// Create Express receiver to allow custom routes
const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN!,
  receiver,
});

// Export both for later use
export { app, receiver };
