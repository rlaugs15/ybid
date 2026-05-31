"use server";

import { CACHE_TAGS } from "@/services/cache-tags";
import { unstable_cache } from "next/cache";
import prisma from "prisma/prisma";

type GetSchedulesParams = {
  scope?: "mine" | "all";
  userId?: string;
  date?: string;
  from?: string;
  to?: string;
  status?: "today" | "week" | "overdue" | "all";
};

export const getSchedules = unstable_cache(
  async (params?: GetSchedulesParams) => {
    const today = new Date().toISOString().slice(0, 10);
    const todayDate = new Date(today);

    return prisma.companies.findMany({
      where: {
        is_archived: false,
        is_contracted: false,

        ...(params?.scope === "mine" &&
          params.userId && {
            owner_id: params.userId,
          }),

        ...(params?.date && {
          next_contact_date: new Date(params.date),
        }),

        ...(params?.from &&
          params?.to && {
            next_contact_date: {
              gte: new Date(params.from),
              lte: new Date(params.to),
            },
          }),

        ...(params?.status === "overdue" && {
          next_contact_date: {
            lt: todayDate,
          },
        }),
      },
      include: {
        users_companies_owner_idTousers: true,
      },
      orderBy: {
        next_contact_date: "asc",
      },
    });
  },
  ["schedules"],
  {
    tags: [CACHE_TAGS.SCHEDULE],
  },
);
