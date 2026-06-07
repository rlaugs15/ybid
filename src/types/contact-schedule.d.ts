export type ContactScheduleFilter = "today" | "week" | "past" | "all";

export type ContactScheduleParams = {
  type?: ContactScheduleFilter;
  date?: string;
};

export type CalendarParams = {
  year: number;
  month: number;
};

export type CreateContactScheduleRequest = {
  companyId: string;
  scheduledAt: string;
  memo?: string;
  createdBy: string;
};

export type UpdateContactScheduleRequest = {
  scheduledAt?: string;
  memo?: string;
  completed?: boolean;
};
