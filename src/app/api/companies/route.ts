// src/app/api/companies/route.ts

import { getUser } from "@/services/user.api";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/prisma";

export async function GET(request: NextRequest) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;

  /**
   * scope
   *
   * 타입:
   * - "mine" | "all" | null
   *
   * 역할:
   * - mine: 내 업체 관리 페이지에서 사용
   * - all: 전체 영업 현황 페이지에서 사용
   * - null: 기본적으로 전체 조회
   */
  const scope = searchParams.get("scope");

  /**
   * keyword
   *
   * 타입:
   * - string | null
   *
   * 역할:
   * - 업체명, 담당자명, 연락처 검색
   *
   * 예시:
   * - "한빛"
   * - "김민수"
   * - "010"
   */
  const keyword = searchParams.get("keyword") ?? "";

  /**
   * interestLevel
   *
   * 타입:
   * - "high" | "medium" | "low" | null
   *
   * 역할:
   * - 관심도 필터
   *
   * high:
   * - 관심도 높음
   *
   * medium:
   * - 관심도 보통
   *
   * low:
   * - 관심도 낮음
   */
  const interestLevel = searchParams.get("interestLevel");

  /**
   * salesStatus
   *
   * 타입:
   * - "new"
   * - "in_progress"
   * - "reviewing"
   * - "hold"
   * - "contracted"
   * - "failed"
   * - null
   *
   * 역할:
   * - 영업 상태 필터
   */
  const salesStatus = searchParams.get("salesStatus");

  /**
   * isContracted
   *
   * 타입:
   * - "true" | "false" | null
   *
   * 역할:
   * - 계약 완료 여부 필터
   *
   * true:
   * - 계약 완료 업체만 조회
   *
   * false:
   * - 계약 전 업체만 조회
   */
  const isContracted = searchParams.get("isContracted");

  const companies = await prisma.companies.findMany({
    where: {
      is_archived: false,

      ...(scope === "mine" && {
        owner_id: user.id,
      }),

      ...(keyword && {
        OR: [
          {
            name: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            manager_name: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            manager_phone: {
              contains: keyword,
              mode: "insensitive",
            },
          },
        ],
      }),

      ...(interestLevel && {
        interest_level: interestLevel,
      }),

      ...(salesStatus && {
        sales_status: salesStatus,
      }),

      ...(isContracted !== null && {
        is_contracted: isContracted === "true",
      }),
    },
    include: {
      users_companies_owner_idTousers: true,
      teams: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return NextResponse.json(companies);
}

export async function POST(request: NextRequest) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  /**
   * body.name
   *
   * 타입:
   * - string
   *
   * 역할:
   * - 업체명
   *
   * 필수 여부:
   * - 필수
   */
  const company = await prisma.companies.create({
    data: {
      /**
       * 업체명
       *
       * 타입:
       * - string
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
       * - "high" | "medium" | "low"
       *
       * 기본값:
       * - "medium"
       */
      interest_level: body.interestLevel ?? "medium",

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
       *
       * 기본값:
       * - "new"
       */
      sales_status: body.salesStatus ?? "new",

      /**
       * 다음 연락 예정일
       *
       * 타입:
       * - string | null
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

      /**
       * 담당자 ID
       *
       * 타입:
       * - string
       *
       * 설명:
       * - 현재 로그인한 유저가 자동으로 담당자가 된다.
       */
      owner_id: user.id,

      /**
       * 팀 ID
       *
       * 타입:
       * - string | null
       *
       * 설명:
       * - 현재 로그인한 유저의 team_id를 자동 저장한다.
       */
      team_id: user.team_id,
    },
  });

  return NextResponse.json(company, { status: 201 });
}
