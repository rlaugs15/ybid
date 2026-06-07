export const userKeys = {
  all: ["user"] as const,

  me: () => [...userKeys.all, "me"] as const,
};

export const companyKeys = {
  all: ["companies"] as const,

  lists: () => [...companyKeys.all, "list"] as const,

  list: (params?: Record<string, unknown>) => [...companyKeys.lists(), params] as const,

  details: () => [...companyKeys.all, "detail"] as const,

  detail: (companyId: string) => [...companyKeys.details(), companyId] as const,
};

export const contactHistoryKeys = {
  all: ["contact-histories"] as const,

  list: (companyId: string) => [...contactHistoryKeys.all, companyId] as const,
};

export const contactScheduleKeys = {
  all: ["contact-schedules"] as const,

  lists: () => [...contactScheduleKeys.all, "list"] as const,

  list: (params?: Record<string, unknown>) => [...contactScheduleKeys.lists(), params] as const,

  calendar: (year: number, month: number) =>
    [...contactScheduleKeys.all, "calendar", year, month] as const,
};

export const contractKeys = {
  all: ["contracts"] as const,

  monthly: (year: number, month: number) => [...contractKeys.all, "monthly", year, month] as const,
};

export const dashboardKeys = {
  all: ["dashboard"] as const,

  summary: (userId: string) => [...dashboardKeys.all, userId] as const,
};

export const monthlyTopSalesKeys = {
  all: ["monthly-top-sales"] as const,

  current: (year: number, month: number) => [...monthlyTopSalesKeys.all, year, month] as const,
};

export const notificationKeys = {
  all: ["notifications"] as const,

  list: (userId: string) => [...notificationKeys.all, userId] as const,

  unreadCount: (userId: string) => [...notificationKeys.all, "unread-count", userId] as const,
};
