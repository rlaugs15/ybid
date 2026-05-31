// 대시보드 API

import { isAdmin } from "@/lib/permissions/company";
import { getUser } from "@/services/user.api";
import { NextResponse } from "next/server";
import prisma from "prisma/prisma";

export async function GET() {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().slice(0, 10);
  const todayDate = new Date(today);

  const monthStart = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);

  const monthEnd = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 1);

  const myCompanies = await prisma.companies.findMany({
    where: {
      owner_id: user.id,
      is_archived: false,
    },
  });

  const todayContacts = myCompanies.filter(
    (company) => company.next_contact_date?.toISOString().slice(0, 10) === today,
  );

  const overdueContacts = myCompanies.filter(
    (company) =>
      company.next_contact_date && company.next_contact_date < todayDate && !company.is_contracted,
  );

  const monthlyContracts = myCompanies.filter(
    (company) =>
      company.contracted_at &&
      company.contracted_at >= monthStart &&
      company.contracted_at < monthEnd,
  );

  const highInterestCompanies = myCompanies.filter((company) => company.interest_level === "high");

  const response = {
    mySummary: {
      myCompanyCount: myCompanies.length,
      todayContactCount: todayContacts.length,
      overdueContactCount: overdueContacts.length,
      monthlyContractCount: monthlyContracts.length,
      highInterestCount: highInterestCompanies.length,
    },

    todayContacts,
  };

  if (!isAdmin(user.role)) {
    return NextResponse.json(response);
  }

  const allCompanies = await prisma.companies.findMany({
    where: {
      is_archived: false,
    },
  });

  const adminSummary = {
    totalCompanyCount: allCompanies.length,

    totalTodayContactCount: allCompanies.filter(
      (company) => company.next_contact_date?.toISOString().slice(0, 10) === today,
    ).length,

    totalOverdueContactCount: allCompanies.filter(
      (company) =>
        company.next_contact_date &&
        company.next_contact_date < todayDate &&
        !company.is_contracted,
    ).length,

    totalContractCount: allCompanies.filter((company) => company.is_contracted).length,
  };

  return NextResponse.json({
    ...response,
    adminSummary,
  });
}
