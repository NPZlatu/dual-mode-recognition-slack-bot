import sendDMToUserByEmail from "../slack/api.js";
import getDeliveryMode from "../db/getDeliveryMode.js";
const { getUserIdByEmail, getOrOpenChannelId } = await import("../slack/api.js");
import saveRecognitionToDB from "../db/saveRecognition.js";
import type { EventData } from "../types/slackTypes.js";

const processWinEvent = async (eventData: EventData) => {
  const { email, text, link } = eventData;
  const message = link ? `${text}\n\n${link}` : text;
  const userId = await getUserIdByEmail(email);
  if (!userId) {
    throw new Error("User ID not found for email: " + email);
  }
  const deliveryMode = await getDeliveryMode(userId);
  const IS_REALTIME_MODE = deliveryMode === "realtime";

  if (IS_REALTIME_MODE) {
    console.log("Processing Win Event in Realtime Mode");
    const { ok } = await sendDMToUserByEmail(email, message);
    if (!ok) {
      throw new Error("Failed to send DM in realtime mode");
    }
    console.log("✅ DM SENT");
    return { success: true };
  } else {
    console.log("Processing Win Event in Batch Mode");
    const channelId = await getOrOpenChannelId(email);
    const userId = await getUserIdByEmail(email);

    const recordPayload = {
      channelId,
      userId,
      email,
      message,
      source: "slack",
      eventType: "win",
      batchDate: new Date(),
    };

    try {
      const saved = await saveRecognitionToDB(recordPayload);
      console.log("✅ Recognition Saved to DB");
      return saved;
    } catch (err) {
      console.error("Failed to save recognition to DB:", err);
      throw err;
    }
  }
};

export default processWinEvent;
