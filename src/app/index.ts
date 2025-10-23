import { App } from "@slack/bolt";
import dotenv from "dotenv";
import { firstCommitRecognition } from "../constants/index.js";
dotenv.config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN!,
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
});

(async () => {
  await app.start();
  console.log("⚡️ Bolt app is running!");

  // Step 1: Find user by email
  const user = await app.client.users.lookupByEmail({
    email: "nirazlatu@gmail.com",
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
    text: firstCommitRecognition,
  });
})();
