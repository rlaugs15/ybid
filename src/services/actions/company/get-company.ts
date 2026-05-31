"use server";

import { CACHE_TAGS } from "@/services/cache-tags";
import { unstable_cache } from "next/cache";
import prisma from "prisma/prisma";

export const getCompany = unstable_cache(
  async (companyId: string) => {
    return prisma.companies.findUnique({
      where: {
        id: companyId,
      },
      include: {
        users_companies_owner_idTousers: true,
        teams: true,
        contact_histories: {
          include: {
            users: true,
          },
          orderBy: {
            contacted_at: "desc",
          },
        },
      },
    });
  },
  ["company-detail"],
  {
    tags: [CACHE_TAGS.COMPANY],
  },
);
