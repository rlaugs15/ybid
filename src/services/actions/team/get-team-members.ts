"use server";

import { CACHE_TAGS } from "@/services/cache-tags";
import { unstable_cache } from "next/cache";
import prisma from "prisma/prisma";

type GetTeamMembersParams = {
  year: number;
  month: number;
  teamId?: string | null;
};

export const getTeamMembers = unstable_cache(
  async ({ year, month, teamId }: GetTeamMembersParams) => {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const today = new Date().toISOString().slice(0, 10);
    const todayDate = new Date(today);

    const members = await prisma.users.findMany({
      where: {
        ...(teamId && {
          team_id: teamId,
        }),
      },
      include: {
        companies_companies_owner_idTousers: true,
      },
    });

    return members.map((member) => {
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
  },
  ["team-members"],
  {
    tags: [CACHE_TAGS.TEAM],
  },
);
