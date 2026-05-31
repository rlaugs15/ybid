// 1등 직원 조회 / 등록 API

import { isAdmin } from "@/lib/permissions/company";
import { getUser } from "@/services/user.api";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  /**
   * year
   *
   * 타입:
   * - number
   *
   * 역할:
   * - 1등 직원 표시를 조회할 연도
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
   * - 1등 직원 표시를 조회할 월
   */
  const month = Number(searchParams.get("month") ?? now.getMonth() + 1);

  const topSales = await prisma.monthly_top_sales.findFirst({
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

  return NextResponse.json(topSales);
}

export async function POST(request: NextRequest) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!isAdmin(user.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();

  const topSales = await prisma.monthly_top_sales.create({
    data: {
      /**
       * year
       *
       * 타입:
       * - number
       *
       * 예시:
       * - 2026
       */
      year: body.year,

      /**
       * month
       *
       * 타입:
       * - number
       *
       * 예시:
       * - 5
       */
      month: body.month,

      /**
       * userId
       *
       * 타입:
       * - string
       *
       * 역할:
       * - 이번 달 1등 직원 ID
       */
      user_id: body.userId,

      /**
       * displayText
       *
       * 타입:
       * - string
       *
       * 역할:
       * - 헤더에 보여줄 문구
       *
       * 예시:
       * - "이번 달 1등: 김영업 / 계약 5건"
       */
      display_text: body.displayText,

      /**
       * isVisible
       *
       * 타입:
       * - boolean
       *
       * 역할:
       * - 헤더 노출 여부
       */
      is_visible: body.isVisible ?? true,

      created_by: user.id,
      updated_by: user.id,
    },
  });

  return NextResponse.json(topSales, { status: 201 });
}
