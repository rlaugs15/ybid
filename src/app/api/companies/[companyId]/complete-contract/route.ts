// 계약 완료 처리 api

import { canEditCompany } from "@/lib/permissions/company";
import { getUser } from "@/services/actions/user.api";
import { NextResponse } from "next/server";
import prisma from "prisma/prisma";

const getDiffDays = (from: Date, to: Date) => {
  const diff = to.getTime() - from.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ companyId: string }>;
  },
) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { companyId } = await params;
  const body = await request.json();

  const company = await prisma.companies.findUnique({
    where: {
      id: companyId,
    },
    include: {
      users_companies_owner_idTousers: true,
    },
  });

  if (!company) {
    return NextResponse.json({ message: "Not Found" }, { status: 404 });
  }

  const editable = canEditCompany({
    currentUser: user,
    companyOwner: company.users_companies_owner_idTousers,
  });

  if (!editable) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  /**
   * body.contractedAt
   *
   * 타입:
   * - string | undefined
   *
   * 역할:
   * - 계약 완료일
   *
   * 예시:
   * - "2026-05-22"
   *
   * 없으면:
   * - 현재 시간으로 처리
   */
  const contractedAt = body.contractedAt ? new Date(body.contractedAt) : new Date();

  /**
   * 계약 소요일
   *
   * 계산 방식:
   * - 계약일 - 업체 등록일
   */
  const durationDays = getDiffDays(company.created_at, contractedAt);

  const result = await prisma.$transaction(async (tx) => {
    const updatedCompany = await tx.companies.update({
      where: {
        id: companyId,
      },
      data: {
        /**
         * 계약 완료 여부
         *
         * 타입:
         * - boolean
         */
        is_contracted: true,

        /**
         * 영업 상태
         *
         * 타입:
         * - "contracted"
         */
        sales_status: "contracted",

        /**
         * 계약 완료일
         *
         * 타입:
         * - Date
         */
        contracted_at: contractedAt,

        /**
         * 계약 메모
         *
         * 타입:
         * - string | undefined
         *
         * 예시:
         * - "1년 컨설팅 계약 완료"
         */
        contract_memo: body.contractMemo,

        /**
         * 계약 소요일
         *
         * 타입:
         * - number
         *
         * 예시:
         * - 12
         */
        contract_duration_days: durationDays,

        updated_at: new Date(),
      },
    });

    await tx.notifications.create({
      data: {
        type: "contract_completed",
        title: "계약 완료",
        content: `${company.name} 계약이 완료되었습니다.`,
        company_id: company.id,
        actor_id: user.id,
      },
    });

    return updatedCompany;
  });

  return NextResponse.json(result);
}
