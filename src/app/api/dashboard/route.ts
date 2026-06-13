import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/prisma";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId || userId === "undefined") {
    return NextResponse.json(
      {
        success: false,
        message: "userId는 필수입니다.",
      },
      { status: 400 },
    );
  }

  const user = await prisma.users.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "사용자를 찾을 수 없습니다.",
      },
      { status: 404 },
    );
  }

  const today = new Date();

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);

  const todayDate = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()),
  );

  let companyWhere = {};

  if (user.role === "member") {
    companyWhere = {
      owner_id: user.id,
    };
  }

  if (user.role === "leader") {
    companyWhere = {
      team_id: user.team_id,
    };
  }

  const [
    myCompanyCount,
    highInterestCount,
    todayContactCount,
    overdueContactCount,
    contractedThisMonthCount,
    todayContacts,
  ] = await Promise.all([
    prisma.companies.count({
      where: {
        ...companyWhere,
        is_archived: false,
      },
    }),

    prisma.companies.count({
      where: {
        ...companyWhere,
        is_archived: false,
        interest_level: "high",
      },
    }),

    prisma.contact_schedules.count({
      where: {
        completed: false,
        scheduled_at: todayDate,
        companies: {
          ...companyWhere,
          is_archived: false,
        },
      },
    }),

    prisma.contact_schedules.count({
      where: {
        completed: false,
        scheduled_at: {
          lt: todayDate,
        },
        companies: {
          ...companyWhere,
          is_archived: false,
        },
      },
    }),

    prisma.companies.count({
      where: {
        ...companyWhere,
        is_archived: false,
        contracted_at: {
          gte: startOfMonth,
          lt: endOfMonth,
        },
      },
    }),

    prisma.contact_schedules.findMany({
      where: {
        completed: false,
        scheduled_at: todayDate,
        companies: {
          ...companyWhere,
          is_archived: false,
        },
      },

      select: {
        id: true,
        scheduled_at: true,

        companies: {
          select: {
            id: true,
            name: true,
            interest_level: true,
            manager_name: true,
            manager_phone: true,
          },
        },
      },

      take: 10,
    }),
  ]);

  return NextResponse.json({
    success: true,

    data: {
      myCompanyCount,

      highInterestCount,

      todayContactCount,

      overdueContactCount,

      contractedThisMonthCount,

      todayContacts,
    },
  });
}
