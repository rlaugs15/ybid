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
      {
        status: 400,
      },
    );
  }

  const topSales = await prisma.monthly_top_sales.findUnique({
    where: {
      year_month: {
        year,
        month,
      },
    },

    include: {
      users_monthly_top_sales_user_idTousers: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
  });

  return NextResponse.json({
    success: true,
    data: topSales,
  });
}

type UpsertMonthlyTopSalesRequest = {
  year: number;
  month: number;

  userId: string;

  displayText: string;

  createdBy: string;
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as UpsertMonthlyTopSalesRequest;

  const result = await prisma.monthly_top_sales.upsert({
    where: {
      year_month: {
        year: body.year,
        month: body.month,
      },
    },

    update: {
      user_id: body.userId,

      display_text: body.displayText,

      updated_by: body.createdBy,

      updated_at: new Date(),

      is_visible: true,
    },

    create: {
      year: body.year,

      month: body.month,

      user_id: body.userId,

      display_text: body.displayText,

      created_by: body.createdBy,

      updated_by: body.createdBy,

      is_visible: true,
    },
  });

  return NextResponse.json({
    success: true,
    data: result,
  });
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const year = Number(searchParams.get("year"));
  const month = Number(searchParams.get("month"));

  await prisma.monthly_top_sales.update({
    where: {
      year_month: {
        year,
        month,
      },
    },

    data: {
      is_visible: false,
      updated_at: new Date(),
    },
  });

  return NextResponse.json({
    success: true,
  });
}
