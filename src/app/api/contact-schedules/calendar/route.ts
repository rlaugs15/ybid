import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/prisma";

/* 응답
[
  {
    "date": "2026-06-01",
    "count": 3
  },
  {
    "date": "2026-06-02",
    "count": 5
  },
  {
    "date": "2026-06-03",
    "count": 1
  }
] */

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const year = Number(searchParams.get("year"));
  const month = Number(searchParams.get("month"));

  if (!year || !month) {
    return NextResponse.json(
      {
        success: false,
        message: "year, month는 필수입니다.",
      },
      { status: 400 },
    );
  }

  const startDate = new Date(year, month - 1, 1);

  const endDate = new Date(year, month, 1);

  const schedules = await prisma.contact_schedules.findMany({
    where: {
      completed: false,
      scheduled_at: {
        gte: startDate,
        lt: endDate,
      },
    },
    select: {
      scheduled_at: true,
    },
  });

  const dateMap = new Map<string, number>();

  schedules.forEach((schedule) => {
    const dateKey = schedule.scheduled_at.toISOString().split("T")[0];

    dateMap.set(dateKey, (dateMap.get(dateKey) ?? 0) + 1);
  });

  const result = Array.from(dateMap.entries()).map(([date, count]) => ({
    date,
    count,
  }));

  return NextResponse.json({
    success: true,
    data: result,
  });
}
