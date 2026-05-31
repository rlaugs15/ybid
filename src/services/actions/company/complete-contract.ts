"use server";

import { CACHE_TAGS } from "@/services/cache-tags";
import { revalidateTag } from "next/cache";
import prisma from "prisma/prisma";

type CompleteContractInput = {
  companyId: string;
  actorId: string;
  contractedAt?: string;
  contractMemo?: string;
};

const getDiffDays = (from: Date, to: Date) => {
  const diff = to.getTime() - from.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export async function completeContract(input: CompleteContractInput) {
  const company = await prisma.companies.findUnique({
    where: {
      id: input.companyId,
    },
  });

  if (!company) {
    throw new Error("업체를 찾을 수 없다.");
  }

  const contractedAt = input.contractedAt ? new Date(input.contractedAt) : new Date();

  const durationDays = getDiffDays(company.created_at, contractedAt);

  const result = await prisma.$transaction(async (tx) => {
    const updatedCompany = await tx.companies.update({
      where: {
        id: input.companyId,
      },
      data: {
        is_contracted: true,
        sales_status: "contracted",
        contracted_at: contractedAt,
        contract_memo: input.contractMemo,
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
        actor_id: input.actorId,
      },
    });

    return updatedCompany;
  });

  revalidateTag(CACHE_TAGS.COMPANY, "max");
  revalidateTag(CACHE_TAGS.COMPANY_LIST, "max");
  revalidateTag(CACHE_TAGS.CONTRACT, "max");
  revalidateTag(CACHE_TAGS.CONTRACT_MONTHLY, "max");
  revalidateTag(CACHE_TAGS.DASHBOARD, "max");
  revalidateTag(CACHE_TAGS.SCHEDULE, "max");
  revalidateTag(CACHE_TAGS.NOTIFICATION, "max");
  revalidateTag(CACHE_TAGS.TOP_SALES, "max");

  return result;
}
