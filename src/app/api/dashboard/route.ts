import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/prisma";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
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

  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

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
    topSales,
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
        scheduled_at: {
          gte: startOfToday,
          lt: endOfToday,
        },
      },
    }),

    prisma.contact_schedules.count({
      where: {
        completed: false,
        scheduled_at: {
          lt: startOfToday,
        },
      },
    }),

    prisma.companies.count({
      where: {
        ...companyWhere,
        contracted_at: {
          gte: startOfMonth,
          lt: endOfMonth,
        },
      },
    }),

    prisma.contact_schedules.findMany({
      where: {
        completed: false,
        scheduled_at: {
          gte: startOfToday,
          lt: endOfToday,
        },
      },

      include: {
        companies: {
          include: {
            users_companies_owner_idTousers: {
              select: {
                name: true,
              },
            },
          },
        },
      },

      orderBy: {
        scheduled_at: "asc",
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

      topSales,
    },
  });
}
