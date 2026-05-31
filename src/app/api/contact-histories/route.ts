// 연락 완료 / 연락 히스토리 등록 API

import { getUser } from "@/services/user.api";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/prisma";

export async function POST(request: NextRequest) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const history = await prisma.contact_histories.create({
    data: {
      /**
       * companyId
       *
       * 타입:
       * - string
       *
       * 역할:
       * - 연락 기록을 남길 업체 ID
       */
      company_id: body.companyId,

      /**
       * userId
       *
       * 타입:
       * - string
       *
       * 역할:
       * - 연락을 기록한 사용자 ID
       *
       * 설명:
       * - 현재 로그인 유저 ID를 자동 저장한다.
       */
      user_id: user.id,

      /**
       * content
       *
       * 타입:
       * - string
       *
       * 역할:
       * - 연락 내용
       *
       * 예시:
       * - "대표와 통화 완료. 다음 주 재연락 예정."
       */
      content: body.content,

      /**
       * contactedAt
       *
       * 타입:
       * - string | undefined
       *
       * 역할:
       * - 실제 연락한 날짜
       *
       * 예시:
       * - "2026-05-22T10:30:00"
       *
       * 없으면:
       * - 현재 시간
       */
      contacted_at: body.contactedAt ? new Date(body.contactedAt) : new Date(),
    },
  });

  return NextResponse.json(history, { status: 201 });
}
