// 연락 예정 API

import { getUser } from "@/services/user.api";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/prisma";

export async function GET(request: NextRequest) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;

  /**
   * scope
   *
   * 타입:
   * - "mine" | "all" | null
   *
   * 역할:
   * - mine: 내 업체의 연락 예정만 조회
   * - all: 전체 업체의 연락 예정 조회
   */
  const scope = searchParams.get("scope");

  /**
   * date
   *
   * 타입:
   * - string | null
   *
   * 역할:
   * - 특정 날짜의 연락 예정 업체만 조회
   *
   * 예시:
   * - "2026-05-22"
   */
  const date = searchParams.get("date");

  /**
   * from
   *
   * 타입:
   * - string | null
   *
   * 역할:
   * - 기간 조회 시작일
   *
   * 예시:
   * - "2026-05-01"
   */
  const from = searchParams.get("from");

  /**
   * to
   *
   * 타입:
   * - string | null
   *
   * 역할:
   * - 기간 조회 종료일
   *
   * 예시:
   * - "2026-05-31"
   */
  const to = searchParams.get("to");

  /**
   * status
   *
   * 타입:
   * - "today" | "week" | "overdue" | "all" | null
   *
   * 역할:
   * - 연락 예정 페이지 상단 탭 필터
   *
   * today:
   * - 오늘 연락 예정
   *
   * week:
   * - 이번 주 연락 예정
   *
   * overdue:
   * - 지난 연락 미처리
   *
   * all:
   * - 전체 연락 예정
   */
  const status = searchParams.get("status");

  const today = new Date();
  const todayDate = new Date(today.toISOString().slice(0, 10));

  const companies = await prisma.companies.findMany({
    where: {
      is_archived: false,
      is_contracted: false,

      ...(scope === "mine" && {
        owner_id: user.id,
      }),

      ...(date && {
        next_contact_date: new Date(date),
      }),

      ...(from &&
        to && {
          next_contact_date: {
            gte: new Date(from),
            lte: new Date(to),
          },
        }),

      ...(status === "overdue" && {
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

  return NextResponse.json(companies);
}
