import { getUser } from "@/services/actions/user/user.api";
import { CACHE_TAGS } from "@/services/cache-tags";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/prisma";

export async function GET() {
  const authUser = await getUser();

  if (!authUser) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  const user = await prisma.users.findUnique({
    where: {
      id: authUser.id,
    },
    select: {
      id: true,
      name: true,
      role: true,
      created_at: true,
    },
  });

  return NextResponse.json({ data: user });
}

export async function PATCH(request: NextRequest) {
  const authUser = await getUser();

  if (!authUser) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  const body = await request.json();

  const updatedUser = await prisma.users.update({
    where: {
      id: authUser.id,
    },

    data: {
      ...(body.name !== undefined && {
        name: body.name,
      }),
    },

    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      team_id: true,
      created_at: true,
    },
  });

  revalidateTag(CACHE_TAGS.ME, "max");

  return NextResponse.json(updatedUser);
}
