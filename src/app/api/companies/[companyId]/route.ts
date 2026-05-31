// src/app/api/companies/[companyId]/route.ts

import { canEditCompany } from "@/lib/permissions/company";
import { getUser } from "@/services/actions/user.api";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/prisma";

export async function GET(
  _request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ companyId: string }>;
  },
) {
  const { companyId } = await params;

  const company = await prisma.companies.findUnique({
    where: {
      id: companyId,
    },
    include: {
      users_companies_owner_idTousers: true,
      teams: true,
      contact_histories: {
        include: {
          users: true,
        },
        orderBy: {
          contacted_at: "desc",
        },
      },
    },
  });

  if (!company) {
    return NextResponse.json({ message: "Not Found" }, { status: 404 });
  }

  return NextResponse.json(company);
}

export async function PATCH(
  request: NextRequest,
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

  // 업체 수정 권한 체크, 현재 로그인 한 사용자와 담당자
  const editable = canEditCompany({
    currentUser: user,
    companyOwner: company.users_companies_owner_idTousers,
  });

  if (!editable) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const updatedCompany = await prisma.companies.update({
    where: {
      id: companyId,
    },
    data: {
      /**
       * 업체명
       *
       * 타입:
       * - string | undefined
       */
      name: body.name,

      /**
       * 대표자명
       *
       * 타입:
       * - string | undefined
       */
      ceo_name: body.ceoName,

      /**
       * 업종
       *
       * 타입:
       * - string | undefined
       */
      business_type: body.businessType,

      /**
       * 지역
       *
       * 타입:
       * - string | undefined
       */
      region: body.region,

      /**
       * 업체 담당자명
       *
       * 타입:
       * - string | undefined
       */
      manager_name: body.managerName,

      /**
       * 업체 담당자 연락처
       *
       * 타입:
       * - string | undefined
       */
      manager_phone: body.managerPhone,

      /**
       * 업체 담당자 이메일
       *
       * 타입:
       * - string | undefined
       */
      manager_email: body.managerEmail,

      /**
       * 관심도
       *
       * 타입:
       * - "high" | "medium" | "low" | undefined
       */
      interest_level: body.interestLevel,

      /**
       * 영업 상태
       *
       * 타입:
       * - "new"
       * - "in_progress"
       * - "reviewing"
       * - "hold"
       * - "contracted"
       * - "failed"
       * - undefined
       */
      sales_status: body.salesStatus,

      /**
       * 다음 연락 예정일
       *
       * 타입:
       * - string | null | undefined
       *
       * 예시:
       * - "2026-05-22"
       */
      next_contact_date: body.nextContactDate ? new Date(body.nextContactDate) : null,

      /**
       * 메모
       *
       * 타입:
       * - string | undefined
       */
      memo: body.memo,

      updated_at: new Date(),
    },
  });

  return NextResponse.json(updatedCompany);
}
