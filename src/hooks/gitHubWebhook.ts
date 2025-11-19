/* This code snippet is importing necessary modules and functions for setting up a route handler using
Express in a TypeScript environment. */
import express from "express";
import processWinEvent from "../utils/processWinEvent.js";
import { SLACK_USER_EMAIL, FIRST_CI_PASS_AFTER_FAILURE } from "../constants.js";

const router = express.Router();

// Simple in-memory history of the last conclusions per workflow (keyed by repo + workflow id)
const workflowHistory = new Map<string, string[]>();

router.post("/github-events", async (req, res) => {
  try {
    console.log("I am here");
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
          const runLink = (run.html_url || payload?.workflow_run?.html_url || "").toString();

          try {
            await processWinEvent({
              email: SLACK_USER_EMAIL,
              text: FIRST_CI_PASS_AFTER_FAILURE,
              link: runLink || undefined,
            });
          } catch (err) {
            console.error("Failed to process nice-win DM:", err);
          }
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
