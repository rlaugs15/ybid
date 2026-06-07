export type UserRole = "member" | "leader" | "admin";

/**
 * 업체 수정 권한 체크
 *
 * currentUser:
 * - 현재 로그인한 사용자
 *
 * companyOwner:
 * - 해당 업체를 담당하는 사용자
 */
export const canEditCompany = ({
  currentUser,
  companyOwner,
}: {
  currentUser: {
    id: string; // 현재 로그인 유저 ID
    role: string; // member | leader | owner
  };
  companyOwner: {
    id: string; // 업체 담당자 ID
    role: string; // member | leader | owner
  };
}) => {
  if (currentUser.role === "owner") return true;

  if (currentUser.role === "leader") {
    return companyOwner.role !== "owner";
  }

  return currentUser.id === companyOwner.id;
};

/**
 * 관리자 권한 체크
 *
 * leader:
 * - 팀장
 *
 * owner:
 * - 대표
 */
export const isAdmin = (role: string) => {
  return role === "leader" || role === "owner";
};
