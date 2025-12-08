import { PrismaClient } from "../generated/prisma/client.js";
const prisma = new PrismaClient();
const getDeliveryMode = async (userId: string): Promise<string> => {
  try {
    const setting = await prisma.appSettings.findFirst({
      where: {
        key: "delivery_mode",
        user_id: userId,
      },
    });

    return setting?.value || "realtime";
  } catch (error) {
    console.error("Error fetching delivery mode:", error);
    return "realtime";
  }
};

export default getDeliveryMode;
