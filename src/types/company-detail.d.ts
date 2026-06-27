import { InterestLevel } from "./common";

export type CompanyDetail = Tables<"companies"> & {
  business_licenses: Tables<"company_business_licenses">[];

  users_companies_owner_idTousers: Pick<Tables<"users">, "id" | "name" | "role">;

  interest_level: InterestLevel;

  teams: Pick<Tables<"teams">, "id" | "name"> | null;

  contact_histories: (Tables<"contact_histories"> & {
    users: Pick<Tables<"users">, "id" | "name"> | null;
  })[];

  contact_schedules: Tables<"contact_schedules">[];
};

/* export type CompanyDetail = Prisma.companiesGetPayload<{
  include: {
    business_licenses: true;
    users_companies_owner_idTousers: {
      select: {
        id: true;
        name: true;
        role: true;
      };
    };
    teams: {
      select: {
        id: true;
        name: true;
      };
    };
    contact_histories: {
      include: {
        users: {
          select: {
            id: true;
            name: true;
          };
        };
      };
    };
    contact_schedules: true;
  };
}>; */
