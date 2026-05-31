"use server";

import { CACHE_TAGS } from "@/services/cache-tags";
import { revalidateTag } from "next/cache";
import prisma from "prisma/prisma";

type CreateCompanyInput = {
  name: string;
  ceoName?: string;
  businessType?: string;
  region?: string;
  managerName?: string;
  managerPhone?: string;
  managerEmail?: string;
  interestLevel?: "high" | "medium" | "low";
  salesStatus?: "new" | "in_progress" | "reviewing" | "hold" | "contracted" | "failed";
  nextContactDate?: string | null;
  memo?: string;
  ownerId: string;
  teamId?: string | null;
};

export async function createCompany(input: CreateCompanyInput) {
  const company = await prisma.companies.create({
    data: {
      name: input.name,
      ceo_name: input.ceoName,
      business_type: input.businessType,
      region: input.region,
      manager_name: input.managerName,
      manager_phone: input.managerPhone,
      manager_email: input.managerEmail,
      interest_level: input.interestLevel ?? "medium",
      sales_status: input.salesStatus ?? "new",
      next_contact_date: input.nextContactDate ? new Date(input.nextContactDate) : null,
      memo: input.memo,
      owner_id: input.ownerId,
      team_id: input.teamId,
    },
  });

  revalidateTag(CACHE_TAGS.COMPANY_LIST, "max");
  revalidateTag(CACHE_TAGS.DASHBOARD, "max");
  revalidateTag(CACHE_TAGS.SCHEDULE, "max");

  return company;
}
