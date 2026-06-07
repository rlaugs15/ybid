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

  const notifications = await prisma.notifications.findMany({
    include: {
      companies: {
        select: {
          id: true,
          name: true,
        },
      },

      users: {
        select: {
          id: true,
          name: true,
        },
      },

      notification_reads: {
        where: {
          user_id: userId,
        },
      },
    },

    orderBy: {
      created_at: "desc",
    },

    take: 100,
  });

  return NextResponse.json({
    success: true,

    data: notifications.map((notification) => ({
      id: notification.id,

      type: notification.type,

      title: notification.title,

      content: notification.content,

      company: notification.companies,

      actor: notification.users,

      createdAt: notification.created_at,

      isRead: notification.notification_reads.length > 0,
    })),
  });
}

type CreateNotificationRequest = {
  type: string;

  title: string;

  content: string;

  companyId?: string;

  actorId?: string;
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as CreateNotificationRequest;

  const notification = await prisma.notifications.create({
    data: {
      type: body.type,

      title: body.title,

      content: body.content,

      company_id: body.companyId,

      actor_id: body.actorId,
    },
  });

  return NextResponse.json(
    {
      success: true,
      data: notification,
    },
    { status: 201 },
  );
}
