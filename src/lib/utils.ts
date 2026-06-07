import { Prisma, users } from "@/generated/prisma/client";
import { clsx, type ClassValue } from "clsx";
import prisma from "prisma/prisma";
import { twMerge } from "tailwind-merge";
import { UserRole } from "./permissions/company";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 캐시키 배열을 문자열로 변환
export const cacheCore = {
  fromKey: (key: readonly (string | number)[]) => key.join(":"),
};

/* 쿼리키에서 undefined나 null 제거하는 함수 */
export function safeKey(...args: (string | number | undefined | null)[]) {
  return args
    .filter((v): v is string | number => v !== undefined && v !== null)
    .map((v) => String(v));
}

export const getInterestBadgeStyle = (priority: "high" | "medium" | "low") => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-700 border-red-200";

    case "medium":
      return "bg-amber-100 text-amber-700 border-amber-200";

    case "low":
      return "bg-slate-100 text-slate-600 border-slate-200";

    default:
      return "";
  }
};

/* 권한체크 함수들 */
export function isAdmin(role: UserRole) {
  return role === "admin";
}

export function isLeader(role: UserRole) {
  return role === "leader";
}

export function isMember(role: UserRole) {
  return role === "member";
}

/* 영업왕 수정 가능 여부 */
export function canManageTopSales(role: UserRole) {
  return role === "admin" || role === "leader";
}

/* 업체 수정 권한 */
export function canEditCompany(currentUser: users, ownerUser: users) {
  if (currentUser.role === "admin") {
    return true;
  }

  if (currentUser.role === "leader") {
    if (ownerUser.role === "admin") {
      return false;
    }

    return currentUser.team_id === ownerUser.team_id;
  }

  return currentUser.id === ownerUser.id;
}

/* 업체 조회 범위 */
export function getCompanyScope(currentUser: users): Prisma.companiesWhereInput {
  if (currentUser.role === "admin") {
    return {};
  }

  if (currentUser.role === "leader") {
    return {
      team_id: currentUser.team_id,
    };
  }

  return {
    owner_id: currentUser.id,
  };
}

/* 업체 수정 권한 검증 */
export async function verifyCompanyPermission(companyId: string, currentUserId: string) {
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

  const currentUser = await prisma.users.findUnique({
    where: {
      id: currentUserId,
    },
  });

  if (!currentUser) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  const allowed = canEditCompany(currentUser, company.users_companies_owner_idTousers);

  if (!allowed) {
    throw new Error("수정 권한이 없습니다.");
  }

  return company;
}
