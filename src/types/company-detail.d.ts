import { Tables } from "./database.types";

export type CompanyDetail = Tables<"companies"> & {
  business_licenses: Tables<"company_business_licenses">[];

  users_companies_owner_idTousers: Pick<Tables<"users">, "id" | "name" | "role">;

  teams: Pick<Tables<"teams">, "id" | "name"> | null;

  contact_histories: (Tables<"contact_histories"> & {
    users: Pick<Tables<"users">, "id" | "name"> | null;
  })[];

  contact_schedules: Tables<"contact_schedules">[];
};
