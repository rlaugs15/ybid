import { getUser } from "@/services/actions/user.api";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/prisma";

export async function GET() {
  const authUser = await getUser();

  if (!authUser) {
    return NextResponse.json(null, { status: 401 });
  }

  const user = await prisma.users.findUnique({
    where: {
      id: authUser.id,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      created_at: true,
    },
  });

  return NextResponse.json(user);
}

export async function PATCH(request: NextRequest) {
  const authUser = await getUser();

  if (!authUser) {
    return NextResponse.json("Unauthorized", { status: 401 });
  }

  const body = await request.json();

  const updated = await prisma.users.update({
    where: {
      id: authUser.id,
    },
    data: {
      ...(body.name ? { name: body.name } : {}),
    },
  });

  return NextResponse.json(updated);
}
