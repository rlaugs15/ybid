import { Prisma, users } from "@/generated/prisma/client";
import { InterestLevel } from "@/types/common";
import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
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

/* 관심도에 따른 뱃지 색 변경 */
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

/* 관심도에 따른 글자색 변경 */
export function getInterestTextStyle(priority: InterestLevel) {
  switch (priority) {
    case "high":
      return "text-red-700";

    case "medium":
      return "text-amber-700";

    case "low":
      return "text-slate-600";

    default:
      return "";
  }
}

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
export function canEditCompany(
  currentUser: Pick<users, "id" | "team_id" | "role">,
  ownerUser: users,
) {
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

/* 날짜 포맷 함수 */
export function formatDate(date: string | Date) {
  return format(new Date(date), "yyyy.MM.dd");
}
