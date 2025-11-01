import express from "express";
import sendDmToUserByEmail from "../utils/sendDm.js";
import { SLACK_USER_EMAIL } from "../constants/index.js";

const router = express.Router();

router.get("/trello-events", (_req, res) => {
  res.status(200).send("✅ Trello webhook received");
});
router.post("/trello-events", async (req, res) => {
  try {
    const payload = req.body as any;
    const action = payload?.action;
    if (!action) {
      return res.status(200).send("No action");
    }

    // Detect card moved into a Done list
    if (action.type === "updateCard") {
      const listAfter = action?.data?.listAfter;
      if (
        listAfter &&
        String(listAfter.name || "")
          .toLowerCase()
          .includes("done")
      ) {
        const card = action.data.card || {};
        console.log(card, "card info");
        const cardName = card.name || "Unnamed card";
        const cardUrl = `https://trello.com/c/${card.shortLink}`;

        const message =
          `🎉 Outstanding work — the task *${cardName}* is DONE ✅\n\n` +
          `Your focus, ownership, and attention to quality made this happen. 🚀`;

        try {
          await sendDmToUserByEmail(SLACK_USER_EMAIL, {
            text: message,
            link: cardUrl,
          });
          console.log("Sent Trello Done DM");
        } catch (err) {
          console.error("Failed to send Trello DM:", err);
        }
      }
    }

    return res.status(200).send("✅ Trello webhook processed");
  } catch (error) {
    console.error("Error handling Trello webhook:", error);
    return res.status(500).send("Internal Server Error");
  }
});

export default router;
