export type DashboardTodayContact = {
  id: string;
  scheduled_at: string;
  companies: {
    id: string;
    name: string;
    interest_level: "high" | "medium" | "low";
    manager_name: string | null;
    manager_phone: string | null;
  };
};

export type DashboardResponse = {
  myCompanyCount: number;
  highInterestCount: number;
  todayContactCount: number;
  overdueContactCount: number;
  contractedThisMonthCount: number;
  todayContacts: DashboardTodayContact[];
};
