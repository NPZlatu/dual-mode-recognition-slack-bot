import express from "express";

const router = express.Router();

router.post("/github-events", async (req, res) => {
  try {
    const ghEvent = (req.get("x-github-event") || "").toString();
    const payload = req.body as any;

    // Detect GitHub Actions workflow run completion
    if (ghEvent === "workflow_run") {
      const action = payload?.action;
      const run = payload?.workflow_run;
      if (action === "completed" && run) {
        const conclusion = run.conclusion;
        if (conclusion === "success") {
          console.log("naaice");
        } else {
          console.log("nopppe");
        }
      }
    }

    res.status(200).send("✅ Webhook processed");
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
