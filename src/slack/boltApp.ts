import Bolt from "@slack/bolt";
const { App, ExpressReceiver } = Bolt;
import { SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET } from "../constants.js";

// Create Express receiver to allow custom routes
const receiver = new ExpressReceiver({
  signingSecret: SLACK_SIGNING_SECRET!,
});

const app = new App({
  token: SLACK_BOT_TOKEN!,
  receiver,
});

// Export both for later use
export { app, receiver };
