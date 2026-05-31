// 월별 계약 완료 현황 API

import { getUser } from "@/services/user.api";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/prisma";

const getMonthRange = (year: number, month: number) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  return { start, end };
};

export async function GET(request: NextRequest) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;

  /**
   * year
   *
   * 타입:
   * - number
   *
   * 역할:
   * - 조회할 연도
   *
   * 예시:
   * - 2026
   *
   * 없으면:
   * - 현재 연도
   */
  const now = new Date();
  const year = Number(searchParams.get("year") ?? now.getFullYear());

  /**
   * month
   *
   * 타입:
   * - number
   *
   * 역할:
   * - 조회할 월
   *
   * 예시:
   * - 5
   *
   * 없으면:
   * - 현재 월
   */
  const month = Number(searchParams.get("month") ?? now.getMonth() + 1);

  /**
   * ownerId
   *
   * 타입:
   * - string | null
   *
   * 역할:
   * - 특정 직원의 계약 완료 현황만 조회할 때 사용
   */
  const ownerId = searchParams.get("ownerId");

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

  return NextResponse.json({
    year,
    month,
    totalCount: contracts.length,
    contracts,
  });
}
