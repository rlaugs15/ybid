// app/api/companies/route.ts

import { CreateCompanyRequest } from "@/types/company";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

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
      ...(interestLevel && { interest_level: interestLevel as "high" | "medium" | "low" }),
      ...(salesStatus && { sales_status: salesStatus }),
      ...(region && { region }),
      ...(keyword && {
        OR: [
          { name: { contains: keyword, mode: "insensitive" } },
          { ceo_name: { contains: keyword, mode: "insensitive" } },
          { ceo_phone: { contains: keyword, mode: "insensitive" } },
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

  if (!body.name) {
    return NextResponse.json(
      {
        success: false,
        message: "업체명은 필수입니다.",
      },
      { status: 400 },
    );
  }

  if (!body.ownerId) {
    return NextResponse.json(
      {
        success: false,
        message: "담당자 ID는 필수입니다.",
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

        interest_level: body.interestLevel ?? "medium",
        sales_status: body.salesStatus ?? "new",
        memo: body.memo,

        owner_id: body.ownerId,
        team_id: body.teamId ?? null,

        business_licenses: {
          create: body.businessLicenses.map((license, index) => ({
            business_group: license.businessGroup,
            business_type: license.businessType,
            specialty_type: license.specialtyType ?? null,
            is_primary: license.isPrimary ?? index === 0,
          })),
        },

        contact_schedules: body.contactSchedule
          ? {
              create: {
                scheduled_at: new Date(body.contactSchedule.scheduledAt),
                memo: body.contactSchedule.memo,
                created_by: body.ownerId,
              },
            }
          : undefined,
      },
      include: {
        business_licenses: true,
        contact_schedules: true,
        users_companies_owner_idTousers: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        teams: true,
      },
    });

    return createdCompany;
  });

  return NextResponse.json(
    {
      success: true,
      data: company,
    },
    { status: 201 },
  );
}
