import { app } from "../slack/boltApp.js";

export type SlackDmMessage = {
  text: string;
  link?: string;
};

// Simple in-memory cache for email -> channelId
const channelCache = new Map<string, string>();

/**
 * Send a direct message to a user identified by email.
 * Message.link (if provided) is appended to the message text.
 * Caches the opened DM channel id to avoid repeated API lookups.
 */
export async function sendDmToUserByEmail(email: string, message: SlackDmMessage) {
  const fullText = message.link ? `${message.text}\n\n${message.link}` : message.text;

  let channelId = channelCache.get(email);

  if (!channelId) {
    const user = await app.client.users.lookupByEmail({ email });
    if (!user.ok) {
      throw new Error(`Slack user lookup failed: ${user.error}`);
    }

    const userId = user.user?.id;
    if (!userId) {
      throw new Error(`No user ID found for email: ${email}`);
    }

    const conv = await app.client.conversations.open({ users: userId });
    channelId = conv.channel?.id;
    if (!channelId) {
      throw new Error(`Failed to open conversation with user: ${email}`);
    }

    channelCache.set(email, channelId);
  }

  try {
    await app.client.chat.postMessage({
      channel: channelId,
      text: fullText,
    });
  } catch (err) {
    // If posting fails (stale channel etc.), try to reopen and retry once, then update cache.
    try {
      const user = await app.client.users.lookupByEmail({ email });
      const userId = user.user?.id;
      if (!userId) throw err;
      const conv = await app.client.conversations.open({ users: userId });
      const newChannelId = conv.channel?.id;
      if (!newChannelId) throw err;

      channelCache.set(email, newChannelId);

      await app.client.chat.postMessage({
        channel: newChannelId,
        text: fullText,
      });

      channelId = newChannelId;
    } catch (retryErr) {
      throw retryErr;
    }
  }

  return { ok: true, channelId };
}

export default sendDmToUserByEmail;
