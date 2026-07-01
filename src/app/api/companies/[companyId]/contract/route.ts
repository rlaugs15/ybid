import { verifyCompanyPermission } from "@/lib/company-permission";
import { getUser } from "@/services/actions/user/user.api";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/prisma";

/* 1. 계약 완료 처리
2. 계약 취소 처리
3. 계약까지 걸린 일수 저장
4. 전체 알림 생성
5. 월별 계약 현황에 반영 */

type RouteContext = {
  params: Promise<{
    companyId: string;
  }>;
};

type UpdateContractRequest = {
  action: "complete" | "cancel";
  memo?: string;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
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

    const body = (await request.json()) as UpdateContractRequest;

    const result = await prisma.$transaction(async (tx) => {
      const company = await tx.companies.findUnique({
        where: {
          id: companyId,
        },
      });

      if (!company) {
        throw new Error("업체를 찾을 수 없습니다.");
      }

      /**
       * 계약 취소
       */
      if (body.action === "cancel") {
        const canceledCompany = await tx.companies.update({
          where: {
            id: companyId,
          },
          data: {
            sales_status: "in_progress",

            contracted_at: null,

            contract_memo: null,

            contract_duration_days: null,
          },
        });

        /*  await tx.notifications.create({
          data: {
            type: "contract_cancel",

            title: "계약 취소",

            content: `${company.name} 업체 계약이 취소되었습니다.`,

            company_id: company.id,

            actor_id: authUser.id,
          },
        }); */

        return canceledCompany;
      }

      /**
       * 계약 완료
       */
      const contractedAt = new Date();

      const durationDays = Math.floor(
        (contractedAt.getTime() - company.created_at.getTime()) / (1000 * 60 * 60 * 24),
      );

      const contractedCompany = await tx.companies.update({
        where: {
          id: companyId,
        },
        data: {
          sales_status: "contracted",

          contracted_at: contractedAt,

          contract_memo: body.memo,

          contract_duration_days: durationDays,
        },
      });

      await tx.notifications.create({
        data: {
          type: "contract_completed",

          title: "계약 완료",

          content: `${company.name} 업체가 계약 완료되었습니다.`,

          company_id: company.id,

          actor_id: authUser.id,
        },
      });

      return contractedCompany;
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "계약 처리에 실패했습니다.",
      },
      {
        status: 500,
      },
    );
  }
}
