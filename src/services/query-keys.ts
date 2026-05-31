export const companyKeys = {
  all: ["companies"] as const,

  lists: () => [...companyKeys.all, "list"] as const,

  list: (params?: {
    scope?: string;
    keyword?: string;
    interestLevel?: string;
    salesStatus?: string;
    isContracted?: boolean;
  }) => [...companyKeys.lists(), params] as const,

  details: () => [...companyKeys.all, "detail"] as const,

  detail: (companyId: string) => [...companyKeys.details(), companyId] as const,
};

export const dashboardKeys = {
  all: ["dashboard"] as const,

  summary: () => [...dashboardKeys.all, "summary"] as const,
};

export const contractKeys = {
  all: ["contracts"] as const,

  monthly: (year: number, month: number) => [...contractKeys.all, "monthly", year, month] as const,
};

export const scheduleKeys = {
  all: ["schedules"] as const,

  list: (params?: { date?: string; from?: string; to?: string; status?: string; scope?: string }) =>
    [...scheduleKeys.all, params] as const,
};

export const teamKeys = {
  all: ["team"] as const,

  members: (year: number, month: number, teamId?: string) =>
    [...teamKeys.all, "members", year, month, teamId] as const,
};

export const topSalesKeys = {
  all: ["top-sales"] as const,

  current: (year: number, month: number) => [...topSalesKeys.all, year, month] as const,
};

export const notificationKeys = {
  all: ["notifications"] as const,
};

export const meKeys = {
  all: ["me"] as const,
};
