export type UpdateCompanyContractRequest = {
  action: "complete" | "cancel";
  memo?: string;
};

export type MonthlyContractParams = {
  year: number;
  month: number;
};
