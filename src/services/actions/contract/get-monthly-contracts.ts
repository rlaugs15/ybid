"use server";

import { CACHE_TAGS } from "@/services/cache-tags";
import { unstable_cache } from "next/cache";
import prisma from "prisma/prisma";

type GetMonthlyContractsParams = {
  year: number;
  month: number;
  ownerId?: string;
};

const getMonthRange = (year: number, month: number) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  return { start, end };
};

export const getMonthlyContracts = unstable_cache(
  async ({ year, month, ownerId }: GetMonthlyContractsParams) => {
    const { start, end } = getMonthRange(year, month);

    const contracts = await prisma.companies.findMany({
      where: {
        is_archived: false,
        is_contracted: true,
        contracted_at: {
          gte: start,
          lt: end,
        },
        ...(ownerId && {
          owner_id: ownerId,
        }),
      },
      include: {
        users_companies_owner_idTousers: true,
      },
      orderBy: {
        contracted_at: "desc",
      },
    });

    return {
      year,
      month,
      totalCount: contracts.length,
      contracts,
    };
  },
  ["monthly-contracts"],
  {
    tags: [CACHE_TAGS.CONTRACT_MONTHLY],
  },
);
