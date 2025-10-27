import express from "express";

const router = express.Router();

// Simple in-memory history of the last conclusions per workflow (keyed by repo + workflow id)
const workflowHistory = new Map<string, string[]>();

router.post("/github-events", async (req, res) => {
  try {
    const ghEvent = (req.get("x-github-event") || "").toString();
    const payload = req.body as any;

    // Detect GitHub Actions workflow run completion
    if (ghEvent === "workflow_run") {
      const action = payload?.action;
      const run = payload?.workflow_run;
      if (action === "completed" && run) {
        const conclusion = (run.conclusion || "").toString().toLowerCase();

        // Build a stable key for this workflow (repo + workflow_id is a good choice)
        const repoFull = payload?.repository?.full_name || "unknown_repo";
        const workflowId = String(run.workflow_id ?? run.id ?? "unknown_workflow");
        const key = `${repoFull}:${workflowId}`;

        const prev = workflowHistory.get(key) ?? [];
        const lastTwo = prev.slice(-2);
        const isRecoveryFromTwoFailures =
          conclusion === "success" &&
          lastTwo.length === 2 &&
          lastTwo[0] === "failure" &&
          lastTwo[1] === "failure";

        // update history (keep last 3 conclusions)
        prev.push(conclusion);
        const recent = prev.slice(-3);
        workflowHistory.set(key, recent);

        if (isRecoveryFromTwoFailures) {
          console.log("naaice");
        } else if (conclusion === "success") {
          // regular success (not preceded by two failures)
          console.log("success (no special streak)");
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
