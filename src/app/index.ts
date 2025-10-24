import { App } from "@slack/bolt";
import dotenv from "dotenv";
import { FIRST_COMMIT_RECOGNITION, SLACK_USER_EMAIL } from "../constants/index.js";
dotenv.config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN!,
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
});

const initApp = async () => {
  await app.start();
  console.log("⚡️ Bolt app is running!");
};

const runRecognitionMessage = async () => {
  await initApp();
  // Step 1: Find user by email
  const user = await app.client.users.lookupByEmail({
    email: SLACK_USER_EMAIL,
  });

  if (!user.ok) {
    console.error("Error finding user:", user.error);
    return;
  }

  // Step 2: Open a DM with that user
  const { channel } = await app.client.conversations.open({
    users: user?.user?.id || "",
  });

  if (!channel) {
    console.error("Error opening conversation");
    return;
  }

  // Step 3: Send message to that DM
  await app.client.chat.postMessage({
    channel: channel.id || "",
    text: FIRST_COMMIT_RECOGNITION,
  });

  console.log("Recognition message sent successfully!");
};

export default runRecognitionMessage;
