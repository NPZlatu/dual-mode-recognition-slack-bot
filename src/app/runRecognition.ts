import { SLACK_USER_EMAIL, FIRST_COMMIT_RECOGNITION } from "../constants/index.js";
import sendDmToUserByEmail from "../utils/sendDm.js";

try {
  await sendDmToUserByEmail(SLACK_USER_EMAIL, {
    text: FIRST_COMMIT_RECOGNITION,
  });
  console.log("🎉 DM sent successfully!");
} catch (err) {
  console.error("Failed to send DM:", err);
  throw err;
}
