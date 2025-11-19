import express from "express";
import processWinEvent from "../utils/processWinEvent.js";
import { SLACK_USER_EMAIL, TRELLO_DONE_RECOGNITION } from "../constants.js";

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
        const cardName = card.name || "Unnamed card";
        const cardUrl = `https://trello.com/c/${card.shortLink}`;

        try {
          await processWinEvent({
            email: SLACK_USER_EMAIL,
            text: TRELLO_DONE_RECOGNITION(cardName),
            link: cardUrl,
          });
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
