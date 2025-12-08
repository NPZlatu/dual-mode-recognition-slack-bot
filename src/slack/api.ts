import { app } from "../slack/boltApp.js";
import { PrismaClient } from "../generated/prisma/client.js";

// Simple in-memory cache for email -> channelId
const channelCache = new Map<string, string>();

export async function getUserIdByEmail(email: string): Promise<string> {
  const user = await app.client.users.lookupByEmail({ email });
  if (!user.ok) {
    throw new Error(`Slack user lookup failed: ${user.error}`);
  }

  const userId = user.user?.id;
  if (!userId) {
    throw new Error(`No user ID found for email: ${email}`);
  }

  return userId;
}

export async function getOrOpenChannelId(email: string): Promise<string> {
  let channelId = channelCache.get(email);

  if (!channelId) {
    const userId = await getUserIdByEmail(email);
    const conv = await app.client.conversations.open({ users: userId });
    channelId = conv.channel?.id;
    if (!channelId) {
      throw new Error(`Failed to open conversation with user: ${email}`);
    }

    channelCache.set(email, channelId);
  }

  return channelId;
}

/**
 * Send a direct message to a user identified by email.
 * Message.link (if provided) is appended to the message text.
 * Caches the opened DM channel id to avoid repeated API lookups.
 */
export async function sendDmToUserByEmail(email: string, message: string) {
  let channelId = await getOrOpenChannelId(email);

  try {
    await app.client.chat.postMessage({
      channel: channelId,
      text: message,
    });
  } catch (err) {
    // If posting fails (stale channel etc.), try to reopen and retry once, then update cache.
    try {
      channelCache.delete(email);
      const newChannelId = await getOrOpenChannelId(email);
      await app.client.chat.postMessage({
        channel: newChannelId,
        text: message,
      });

      channelId = newChannelId;
    } catch (retryErr) {
      throw retryErr;
    }
  }
  return { ok: true, channelId };
}

export async function handleDeliveryCommand({
  command,
  ack,
  respond,
}: {
  command: any;
  ack: any;
  respond: any;
}) {
  await ack();

  const option = command.text?.trim().toLowerCase();
  if (!option || (option !== "realtime" && option !== "digest")) {
    return respond("Please specify an option:\n• realtime\n• digest");
  }
  const userId = command.user_id;

  const prisma = new PrismaClient();
  try {
    const updateResult = await prisma.appSettings.updateMany({
      where: { key: "delivery_mode", user_id: userId },
      data: { value: option },
    });
    if (updateResult.count === 0) {
      await prisma.appSettings.create({
        data: { key: "delivery_mode", value: option, user_id: userId },
      });
    }
  } catch (error) {
    console.error("Error updating delivery mode:", error);
    return respond(
      "❌ An error occurred while updating your delivery mode. Please try again later.",
    );
  } finally {
    await prisma.$disconnect();
  }

  if (option === "realtime") {
    return respond(`🚀 Delivery mode set to *Realtime*! Messages will be delivered instantly.`);
  }

  if (option === "digest") {
    return respond(
      `📦 Delivery mode set to *Digest*! Messages will be sent in a batch at *6 PM* every day.`,
    );
  }
}

export default sendDmToUserByEmail;
