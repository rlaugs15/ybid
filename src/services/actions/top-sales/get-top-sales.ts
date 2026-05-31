"use server";

import { CACHE_TAGS } from "@/services/cache-tags";
import { unstable_cache } from "next/cache";
import prisma from "prisma/prisma";

type GetTopSalesParams = {
  year: number;
  month: number;
};

export const getTopSales = unstable_cache(
  async ({ year, month }: GetTopSalesParams) => {
    return prisma.monthly_top_sales.findFirst({
      where: {
        year,
        month,
        is_visible: true,
      },
      include: {
        users_monthly_top_sales_user_idTousers: true,
      },
      orderBy: {
        updated_at: "desc",
      },
    });
  },
  ["top-sales"],
  {
    tags: [CACHE_TAGS.TOP_SALES],
  },
);
