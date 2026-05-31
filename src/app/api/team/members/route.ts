// 팀원별 현황 API

import { isAdmin } from "@/lib/permissions/company";
import { getUser } from "@/services/actions/user.api";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/prisma";

export async function GET(request: NextRequest) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!isAdmin(user.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = request.nextUrl;

  /**
   * year
   *
   * 타입:
   * - number
   *
   * 역할:
   * - 팀원별 계약 성과를 계산할 연도
   *
   * 예시:
   * - 2026
   */
  const now = new Date();
  const year = Number(searchParams.get("year") ?? now.getFullYear());

  /**
   * month
   *
   * 타입:
   * - number
   *
   * 역할:
   * - 팀원별 계약 성과를 계산할 월
   *
   * 예시:
   * - 5
   */
  const month = Number(searchParams.get("month") ?? now.getMonth() + 1);

  /**
   * teamId
   *
   * 타입:
   * - string | null
   *
   * 역할:
   * - 특정 팀의 직원만 조회할 때 사용
   *
   * 없으면:
   * - 현재 로그인 유저의 team_id 기준 조회
   */
  const teamId = searchParams.get("teamId") ?? user.team_id;

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  const today = new Date().toISOString().slice(0, 10);
  const todayDate = new Date(today);

  const members = await prisma.users.findMany({
    where: {
      team_id: teamId,
    },
    include: {
      companies_companies_owner_idTousers: true,
    },
  });

  const result = members.map((member) => {
    const companies = member.companies_companies_owner_idTousers.filter(
      (company) => !company.is_archived,
    );

    const monthlyContracts = companies.filter((company) => {
      if (!company.contracted_at) return false;
      return company.contracted_at >= start && company.contracted_at < end;
    });

    const durations = monthlyContracts
      .map((company) => company.contract_duration_days)
      .filter((value): value is number => typeof value === "number");

    const averageContractDuration =
      durations.length > 0 ? durations.reduce((acc, cur) => acc + cur, 0) / durations.length : 0;

    return {
      id: member.id,
      name: member.name,
      role: member.role,

      companyCount: companies.length,

      todayContactCount: companies.filter(
        (company) => company.next_contact_date?.toISOString().slice(0, 10) === today,
      ).length,

      overdueContactCount: companies.filter(
        (company) =>
          company.next_contact_date &&
          company.next_contact_date < todayDate &&
          !company.is_contracted,
      ).length,

      monthlyContractCount: monthlyContracts.length,

      averageContractDuration,
    };
  });

  return NextResponse.json(result);
}
