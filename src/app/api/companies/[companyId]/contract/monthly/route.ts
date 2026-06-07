import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/prisma";

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

  const contracts = await prisma.companies.findMany({
    where: {
      contracted_at: {
        gte: startDate,
        lt: endDate,
      },
    },

    include: {
      users_companies_owner_idTousers: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },

      teams: true,
    },

    orderBy: {
      contracted_at: "desc",
    },
  });

  const totalCount = contracts.length;

  const averageDurationDays =
    contracts.length === 0
      ? 0
      : Math.round(
          contracts.reduce((sum, company) => sum + (company.contract_duration_days ?? 0), 0) /
            contracts.length,
        );

  const userMap = new Map<
    string,
    {
      userId: string;
      name: string;
      contractCount: number;
    }
  >();

  contracts.forEach((company) => {
    const user = company.users_companies_owner_idTousers;

    const prev = userMap.get(user.id);

    userMap.set(user.id, {
      userId: user.id,
      name: user.name,
      contractCount: (prev?.contractCount ?? 0) + 1,
    });
  });

  const userStats = Array.from(userMap.values()).sort((a, b) => b.contractCount - a.contractCount);

  const topSalesUser = userStats.length > 0 ? userStats[0] : null;

  return NextResponse.json({
    success: true,

    data: {
      totalCount,

      averageDurationDays,

      topSalesUser,

      contracts,

      userStats,
    },
  });
}
