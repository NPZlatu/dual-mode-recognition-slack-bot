import { PrismaClient } from "../generated/prisma/client.js";
const prisma = new PrismaClient();

type SavePayload = {
  userId?: string | null;
  email?: string | null;
  channelId?: string | null;
  message: string;
  source?: string | null;
  eventType?: string | null;
  batchDate?: Date | null;
};

export default async function saveRecognitionToDB(payload: SavePayload) {
  const data = {
    userId: payload.userId ?? null,
    email: payload.email ?? null,
    channelId: payload.channelId ?? null,
    message: payload.message,
    source: payload.source ?? "slack",
    eventType: payload.eventType ?? "win",
    batchDate: payload.batchDate ?? new Date(),
  };

  return prisma.messageQueue.create({ data });
}
