import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/prisma";

type RouteContext = {
  params: Promise<{
    notificationId: string;
  }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const { notificationId } = await context.params;

  const body = (await request.json()) as {
    userId: string;
  };

  const read = await prisma.notification_reads.upsert({
    where: {
      notification_id_user_id: {
        notification_id: notificationId,

        user_id: body.userId,
      },
    },

    update: {
      read_at: new Date(),
    },

    create: {
      notification_id: notificationId,

      user_id: body.userId,
    },
  });

  return NextResponse.json({
    success: true,
    data: read,
  });
}
