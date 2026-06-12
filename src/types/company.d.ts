export type BusinessLicenseInput = {
  businessGroup: string;
  businessType: string;
  specialtyType?: string | null;
  isPrimary?: boolean;
};

export type CreateCompanyRequest = {
  name: string;
  ceoName?: string;
  ceoPhone?: string;
  region?: string;

  managerName?: string;
  managerPhone?: string;

  interestLevel?: "high" | "medium" | "low";
  salesStatus?: string;
  memo?: string;

  teamId?: string | null;

  businessLicenses: BusinessLicenseInput[];

  contactSchedule?: {
    scheduledAt: string;
    memo?: string;
  } | null;
};

export type UpdateCompanyRequest = Partial<Omit<CreateCompanyRequest, "ownerId">>;

export type CompanyListParams = {
  ownerId?: string;
  teamId?: string;
  keyword?: string;
  interestLevel?: string;
  salesStatus?: string;
  region?: string;
};
