import { InterestLevel } from "./common";
import { Tables } from "./database.types";

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

/* -------------------------------------------------------------------------- */
/*                              Company Response                              */
/* -------------------------------------------------------------------------- */

export type CompanyOwner = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type CompanySummary = {
  id: string;

  created_at: string;
  updated_at: string | null;

  name: string;

  ceo_name: string | null;
  ceo_phone: string | null;

  manager_name: string | null;
  manager_phone: string | null;

  region: string | null;

  interest_level: InterestLevel;

  sales_status: string;

  memo: string | null;

  owner_id: string;
  team_id: string | null;

  contracted_at: string | null;
  contract_memo: string | null;
  contract_duration_days: number | null;

  is_archived: boolean;
  archived_at: string | null;
  archived_by: string | null;
  archive_reason: string | null;

  business_licenses: Tables<"company_business_licenses">[];

  users_companies_owner_idTousers: CompanyOwner;

  teams: Tables<"teams"> | null;

  contact_schedules: Tables<"contact_schedules">[];
};
