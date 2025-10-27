import { app } from "../slack/boltApp.js";
import { SLACK_USER_EMAIL, FIRST_COMMIT_RECOGNITION } from "../constants/index.js";

const user = await app.client.users.lookupByEmail({ email: SLACK_USER_EMAIL });
if (!user.ok) {
  console.error("Slack user lookup failed:", user.error);
}

const { channel } = await app.client.conversations.open({
  users: user.user?.id || "",
});

if (!channel || !channel.id) {
  console.error("Failed to open conversation with user:", SLACK_USER_EMAIL);
  throw new Error(`Failed to open conversation with user: ${SLACK_USER_EMAIL}`);
}

await app.client.chat.postMessage({
  channel: channel.id,
  text: FIRST_COMMIT_RECOGNITION,
});

console.log("🎉 DM sent successfully!");
