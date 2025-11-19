import cron from "node-cron";
import { PrismaClient } from "../generated/prisma/client.js";
import sendDMToUserByEmail from "../slack/api.js";
import { IS_DIGEST_MODE } from "../constants.js";
import { CRON_PATTERN } from "../constants.js";

const processBatchEvents = async () => {
  const prisma = new PrismaClient();

  if (IS_DIGEST_MODE) {
    cron.schedule(CRON_PATTERN, async () => {
      console.log(`[digestCron] tick ${new Date().toISOString()}`);

      try {
        const rows = await prisma.messageQueue.findMany({
          where: { delivered: false },
          orderBy: { batchDate: "asc" },
        });

        if (!rows.length) {
          console.log("[digestCron] no pending messages");
          return;
        }

        // Group by email (fallback to userId if email missing)
        const groups = new Map<
          string,
          { ids: number[]; email?: string | null; userId?: string | null; messages: string[] }
        >();

        for (const r of rows) {
          const key = r.email ?? r.userId ?? "unknown";
          const g = groups.get(key) ?? { ids: [], email: r.email, userId: r.userId, messages: [] };
          g.ids.push(r.id);
          g.messages.push(r.message);
          groups.set(key, g);
        }

        for (const [key, group] of groups.entries()) {
          const recipient = group.email ?? group.userId;
          if (!recipient) {
            console.warn(`[digestCron] skipping group ${key} — no recipient`);
            continue;
          }

          // Build a readable batch message
          const header = `You have ${group.ids.length} new recognition(s):\n`;
          const body = group.messages.map((m, i) => `${i + 1}. ${m}`).join("\n\n");
          const batchMessage = `${header}\n${body}`;

          try {
            const { ok } = await sendDMToUserByEmail(recipient, batchMessage);
            if (!ok) {
              console.error(`[digestCron] failed to send batch to ${recipient}`);
              continue;
            }

            // mark delivered
            await prisma.messageQueue.updateMany({
              where: { id: { in: group.ids } },
              data: { delivered: true, deliveredDateTime: new Date() },
            });

            console.log(
              `[digestCron] sent and marked ${group.ids.length} messages for ${recipient}`,
            );
          } catch (err) {
            console.error(`[digestCron] error sending batch to ${recipient}:`, err);
          }
        }
      } catch (err) {
        console.error("[digestCron] unexpected error:", err);
      }
    });
  }
};

export default processBatchEvents;
