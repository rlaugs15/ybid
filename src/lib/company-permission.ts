import { users } from "@/generated/prisma/client";
import { canEditCompany } from "@/lib/utils";
import prisma from "prisma/prisma";

/* 직원(member)
→ 본인 업체만 수정

팀장(leader)
→ 팀원 업체 수정 가능
→ 대표 업체 수정 불가

대표(admin)
→ 전부 수정 가능 */

export async function verifyCompanyPermission(companyId: string, currentUser: Pick<users, "id" | "team_id" | "role">) {
  const company = await prisma.companies.findUnique({
    where: {
      id: companyId,
    },

    include: {
      users_companies_owner_idTousers: true,
    },
  });

  if (!company) {
    throw new Error("업체를 찾을 수 없습니다.");
  }

  if (!currentUser) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  const allowed = canEditCompany(currentUser, company.users_companies_owner_idTousers);

  if (!allowed) {
    throw new Error("수정 권한이 없습니다.");
  }

  return company;
}
