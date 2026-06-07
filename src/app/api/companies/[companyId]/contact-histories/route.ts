import { verifyCompanyPermission } from "@/lib/company-permission";
import { getUser } from "@/services/actions/user/user.api";
import { CreateContactHistoryRequest } from "@/types/contact-history";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/prisma";

/* GET
- 업체 연락 이력 조회

POST
- 연락 이력 추가
- 다음 연락 일정 생성 가능
- 기존 연락 예정 완료 처리 가능 */

type RouteContext = {
  params: Promise<{
    companyId: string;
  }>;
};

export async function GET(_: NextRequest, context: RouteContext) {
  const { companyId } = await context.params;

  const histories = await prisma.contact_histories.findMany({
    where: {
      company_id: companyId,
    },

    include: {
      users: {
        select: {
          id: true,
          name: true,
        },
      },
    },

    orderBy: {
      contacted_at: "desc",
    },
  });

  return NextResponse.json({
    success: true,
    data: histories,
  });
}

/* 응답 예시
{
  "success": true,
  "data": {
    "id": "history-id",
    "content": "전화 상담 진행",
    "contacted_at": "2026-05-22T12:00:00.000Z"
  }
} */

export async function POST(request: NextRequest, context: RouteContext) {
  const authUser = await getUser();

  if (!authUser) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  const { companyId } = await context.params;

  await verifyCompanyPermission(companyId, authUser);

  const body = (await request.json()) as CreateContactHistoryRequest;

  if (!body.content) {
    return NextResponse.json(
      {
        success: false,
        message: "연락 내용은 필수입니다.",
      },
      {
        status: 400,
      },
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    const history = await tx.contact_histories.create({
      data: {
        company_id: companyId,

        user_id: authUser.id,

        content: body.content,
      },
    });

    await tx.contact_schedules.updateMany({
      where: {
        company_id: companyId,
        completed: false,
      },

      data: {
        completed: true,
        completed_at: new Date(),
      },
    });

    if (body.nextContactDate) {
      await tx.contact_schedules.create({
        data: {
          company_id: companyId,

          scheduled_at: new Date(body.nextContactDate),

          memo: body.nextContactMemo,

          created_by: authUser.id,
        },
      });
    }

    return history;
  });

  return NextResponse.json({
    success: true,
    data: result,
  });
}
