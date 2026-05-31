"use server";

import { CACHE_TAGS } from "@/services/cache-tags";
import { unstable_cache } from "next/cache";
import prisma from "prisma/prisma";

export const getNotifications = unstable_cache(
  async (userId: string) => {
    return prisma.notifications.findMany({
      where: {
        actor_id: userId,
      },
      include: {
        companies: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
  },
  ["notifications"],
  {
    tags: [CACHE_TAGS.NOTIFICATION],
  },
);
