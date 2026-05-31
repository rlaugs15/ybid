"use server";

import { isAdmin } from "@/lib/permissions/company";
import { CACHE_TAGS } from "@/services/cache-tags";
import { unstable_cache } from "next/cache";
import prisma from "prisma/prisma";

type GetDashboardParams = {
  userId: string;
  role: string;
};

export const getDashboard = unstable_cache(
  async ({ userId, role }: GetDashboardParams) => {
    const today = new Date().toISOString().slice(0, 10);
    const todayDate = new Date(today);

    const monthStart = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);

    const monthEnd = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 1);

    const myCompanies = await prisma.companies.findMany({
      where: {
        owner_id: userId,
        is_archived: false,
      },
    });

    const response = {
      mySummary: {
        myCompanyCount: myCompanies.length,
        todayContactCount: myCompanies.filter(
          (company) => company.next_contact_date?.toISOString().slice(0, 10) === today,
        ).length,
        overdueContactCount: myCompanies.filter(
          (company) =>
            company.next_contact_date &&
            company.next_contact_date < todayDate &&
            !company.is_contracted,
        ).length,
        monthlyContractCount: myCompanies.filter(
          (company) =>
            company.contracted_at &&
            company.contracted_at >= monthStart &&
            company.contracted_at < monthEnd,
        ).length,
        highInterestCount: myCompanies.filter((company) => company.interest_level === "high")
          .length,
      },
      todayContacts: myCompanies.filter(
        (company) => company.next_contact_date?.toISOString().slice(0, 10) === today,
      ),
    };

    if (!isAdmin(role)) {
      return response;
    }

    const allCompanies = await prisma.companies.findMany({
      where: {
        is_archived: false,
      },
    });

    return {
      ...response,
      adminSummary: {
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
      },
    };
  },
  ["dashboard"],
  {
    tags: [CACHE_TAGS.DASHBOARD],
  },
);
