// 알림 API

// src/app/api/notifications/route.ts

import { getUser } from "@/services/user.api";
import { NextResponse } from "next/server";
import prisma from "prisma/prisma";

export async function GET() {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const notifications = await prisma.notifications.findMany({
    where: {
      /**
       * actor_id
       *
       * 타입:
       * - string
       *
       * 설명:
       * - 현재 스키마상 알림 수신자 필드가 따로 없기 때문에
       *   우선 actor_id 기준으로 조회한다.
       *
       * 추천:
       * - 나중에 receiver_id를 추가하는 게 더 좋다.
       */
      actor_id: user.id,
    },
    include: {
      companies: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return NextResponse.json(notifications);
}
