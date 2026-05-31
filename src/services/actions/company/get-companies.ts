"use server";

import { CACHE_TAGS } from "@/services/cache-tags";
import { unstable_cache } from "next/cache";
import prisma from "prisma/prisma";

type GetCompaniesParams = {
  scope?: "mine" | "all";
  userId?: string;
  keyword?: string;
  interestLevel?: "high" | "medium" | "low";
  salesStatus?: "new" | "in_progress" | "reviewing" | "hold" | "contracted" | "failed";
  isContracted?: boolean;
};

export const getCompanies = unstable_cache(
  async (params?: GetCompaniesParams) => {
    return prisma.companies.findMany({
      where: {
        is_archived: false,

        ...(params?.scope === "mine" &&
          params.userId && {
            owner_id: params.userId,
          }),

        ...(params?.keyword && {
          OR: [
            {
              name: {
                contains: params.keyword,
                mode: "insensitive",
              },
            },
            {
              manager_name: {
                contains: params.keyword,
                mode: "insensitive",
              },
            },
            {
              manager_phone: {
                contains: params.keyword,
                mode: "insensitive",
              },
            },
          ],
        }),

        ...(params?.interestLevel && {
          interest_level: params.interestLevel,
        }),

        ...(params?.salesStatus && {
          sales_status: params.salesStatus,
        }),

        ...(typeof params?.isContracted === "boolean" && {
          is_contracted: params.isContracted,
        }),
      },
      include: {
        users_companies_owner_idTousers: true,
        teams: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
  },
  ["companies"],
  {
    tags: [CACHE_TAGS.COMPANY_LIST],
  },
);
