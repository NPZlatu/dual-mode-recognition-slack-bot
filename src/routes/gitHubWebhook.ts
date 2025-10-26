import express from "express";

const router = express.Router();

router.post("/github-events", async (req, res) => {
  try {
    const event = req.headers["x-github-event"];
    const payload = req.body;

    console.log("📬 GitHub Event Received:", event);

    // Example: handle push event
    if (event === "push") {
      const repo = payload.repository.full_name;
      const pusher = payload.pusher.name;
      console.log(`🚀 ${pusher} pushed to ${repo}`);
    }

    res.status(200).send("✅ Event received");
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
