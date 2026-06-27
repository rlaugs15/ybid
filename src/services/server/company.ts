import prisma from "prisma/prisma";

export async function findCompany(companyId: string) {
  return prisma.companies.findUnique({
    where: {
      id: companyId,
    },
    include: {
      business_licenses: {
        orderBy: {
          created_at: "asc",
        },
      },

      users_companies_owner_idTousers: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },

      teams: {
        select: {
          id: true,
          name: true,
        },
      },

      contact_histories: {
        include: {
          users: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          contacted_at: "desc",
        },
      },

      contact_schedules: {
        where: {
          completed: false,
        },
        orderBy: {
          scheduled_at: "asc",
        },
      },
    },
  });
}
