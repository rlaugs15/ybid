import { verifyCompanyPermission } from "@/lib/company-permission";
import { getUser } from "@/services/actions/user/user.api";
import { UpdateCompanyRequest } from "@/types/company";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/prisma";

type RouteContext = {
  params: Promise<{
    companyId: string;
  }>;
};

export async function GET(_: NextRequest, context: RouteContext) {
  const { companyId } = await context.params;

  const company = await prisma.companies.findUnique({
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

  if (!company) {
    return NextResponse.json(
      {
        success: false,
        message: "업체를 찾을 수 없습니다.",
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    success: true,
    data: company,
  });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const authUser = await getUser();
  if (!authUser) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }

  const { companyId } = await context.params;

  await verifyCompanyPermission(companyId, authUser);

  const body = (await request.json()) as UpdateCompanyRequest;

  const company = await prisma.$transaction(async (tx) => {
    const updatedCompany = await tx.companies.update({
      where: {
        id: companyId,
      },
      data: {
        name: body.name,
        ceo_name: body.ceoName,
        ceo_phone: body.ceoPhone,
        region: body.region,

        interest_level: body.interestLevel,
        sales_status: body.salesStatus,
        memo: body.memo,

        team_id: body.teamId,
      },
    });

    if (body.businessLicenses) {
      await tx.company_business_licenses.deleteMany({
        where: {
          company_id: companyId,
        },
      });

      await tx.company_business_licenses.createMany({
        data: body.businessLicenses.map((license, index) => ({
          company_id: companyId,

          business_group: license.businessGroup,

          business_type: license.businessType,

          specialty_type: license.specialtyType ?? null,

          is_primary: license.isPrimary ?? index === 0,
        })),
      });
    }

    if (body.contactSchedule) {
      await tx.contact_schedules.deleteMany({
        where: {
          company_id: companyId,
          completed: false,
        },
      });

      await tx.contact_schedules.create({
        data: {
          company_id: companyId,

          scheduled_at: new Date(body.contactSchedule.scheduledAt),

          memo: body.contactSchedule.memo,

          created_by: updatedCompany.owner_id,
        },
      });
    }

    return updatedCompany;
  });

  return NextResponse.json({
    success: true,
    data: company,
  });
}

export async function DELETE(_: NextRequest, context: RouteContext) {
  const authUser = await getUser();

  if (!authUser) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }

  const { companyId } = await context.params;

  await verifyCompanyPermission(companyId, authUser);

  await prisma.companies.update({
    where: {
      id: companyId,
    },
    data: {
      is_archived: true,
      archived_at: new Date(),
    },
  });

  return NextResponse.json({
    success: true,
  });
}
