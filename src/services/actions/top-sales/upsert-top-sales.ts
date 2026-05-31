"use server";

import { CACHE_TAGS } from "@/services/cache-tags";
import { revalidateTag } from "next/cache";
import prisma from "prisma/prisma";

type UpsertTopSalesInput = {
  year: number;
  month: number;
  userId?: string | null;
  displayText: string;
  isVisible: boolean;
  actorId: string;
};

export async function upsertTopSales(input: UpsertTopSalesInput) {
  const existing = await prisma.monthly_top_sales.findFirst({
    where: {
      year: input.year,
      month: input.month,
    },
  });

  const topSales = existing
    ? await prisma.monthly_top_sales.update({
        where: {
          id: existing.id,
        },
        data: {
          user_id: input.userId,
          display_text: input.displayText,
          is_visible: input.isVisible,
          updated_by: input.actorId,
          updated_at: new Date(),
        },
      })
    : await prisma.monthly_top_sales.create({
        data: {
          year: input.year,
          month: input.month,
          user_id: input.userId,
          display_text: input.displayText,
          is_visible: input.isVisible,
          created_by: input.actorId,
          updated_by: input.actorId,
        },
      });

  revalidateTag(CACHE_TAGS.TOP_SALES, "none"); // use cache로 캐싱된 상위 매출 정보 즉시 갱신
  revalidateTag(CACHE_TAGS.DASHBOARD, "none"); // 대시보드 캐시도 즉시 갱신

  return topSales;
}
