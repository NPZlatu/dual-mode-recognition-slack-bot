import { SLACK_USER_EMAIL, FIRST_COMMIT_RECOGNITION } from "../constants.js";
import processWinEvent from "../utils/processWinEvent.js";

try {
  await processWinEvent({
    email: SLACK_USER_EMAIL,
    text: FIRST_COMMIT_RECOGNITION,
  });
} catch (err) {
  console.error("Failed to send DM:", err);
  throw err;
}
