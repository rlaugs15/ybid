import { InterestLevel } from "./common";

export type DashboardTodayContact = {
  id: string;
  scheduled_at: string;
  companies: {
    id: string;
    name: string;
    interest_level: InterestLevel;
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
