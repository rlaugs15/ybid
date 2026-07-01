// app/api/companies/route.ts

import { getUser } from "@/services/actions/user/user.api";
import { InterestLevel } from "@/types/common";
import { CreateCompanyRequest } from "@/types/company";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  console.log("searchParams", searchParams);

  const ownerId = searchParams.get("ownerId");
  const teamId = searchParams.get("teamId");
  const keyword = searchParams.get("keyword");
  const interestLevel = searchParams.get("interestLevel");
  const salesStatus = searchParams.get("salesStatus");
  const region = searchParams.get("region");

  const companies = await prisma.companies.findMany({
    where: {
      is_archived: false,
      ...(ownerId && { owner_id: ownerId }),
      ...(teamId && { team_id: teamId }),
      ...(interestLevel && { interest_level: interestLevel as InterestLevel }),
      ...(salesStatus && { sales_status: salesStatus }),
      ...(region && { region }),
      ...(keyword && {
        OR: [
          {
            name: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            ceo_name: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            ceo_phone: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            manager_name: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            manager_phone: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            region: {
              contains: keyword,
              mode: "insensitive",
            },
          },
        ],
      }),
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
          email: true,
          role: true,
        },
      },
      teams: true,
      contact_schedules: {
        orderBy: {
          scheduled_at: "asc",
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return NextResponse.json({
    success: true,
    data: companies,
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as CreateCompanyRequest;

  const authUser = await getUser();

  if (!authUser) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  if (!body.name) {
    return NextResponse.json(
      {
        success: false,
        message: "업체명은 필수입니다.",
      },
      { status: 400 },
    );
  }

  if (!body.businessLicenses || body.businessLicenses.length === 0) {
    return NextResponse.json(
      {
        success: false,
        message: "공사업 정보는 최소 1개 이상 필요합니다.",
      },
      { status: 400 },
    );
  }

  const company = await prisma.$transaction(async (tx) => {
    const createdCompany = await tx.companies.create({
      data: {
        name: body.name,
        ceo_name: body.ceoName,
        ceo_phone: body.ceoPhone,
        region: body.region,
        manager_name: body.managerName,
        manager_phone: body.managerPhone,
        interest_level: body.interestLevel ?? "medium",
        sales_status: body.salesStatus ?? "new",
        memo: body.memo,
        owner_id: authUser.id,
        team_id: body.teamId ?? null,
      },
    });

    await tx.company_business_licenses.createMany({
      data: body.businessLicenses.map((license, index) => ({
        company_id: createdCompany.id,
        business_group: license.businessGroup,
        business_type: license.businessType,
        specialty_type: license.specialtyType ?? null,
        is_primary: license.isPrimary ?? index === 0,
      })),
    });

    if (body.contactSchedule) {
      await tx.contact_schedules.create({
        data: {
          company_id: createdCompany.id,
          scheduled_at: new Date(body.contactSchedule.scheduledAt),
          memo: body.contactSchedule.memo,
          created_by: authUser.id,
        },
      });
    }

    return createdCompany;
  });

  return NextResponse.json(
    {
      success: true,
      data: {
        id: company.id,
      },
    },
    { status: 201 },
  );
}
