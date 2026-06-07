export type MonthlyTopSalesParams = {
  year: number;
  month: number;
};

export type UpsertMonthlyTopSalesRequest = {
  year: number;
  month: number;

  userId: string;

  displayText: string;

  createdBy: string;
};
