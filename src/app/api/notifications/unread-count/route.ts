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

  const count = await prisma.notifications.count({
    where: {
      notification_reads: {
        none: {
          user_id: userId,
        },
      },
    },
  });

  return NextResponse.json({
    success: true,
    data: {
      count,
    },
  });
}
