import { NextRequest, NextResponse } from "next/server";
import prisma from "prisma/prisma";

type RouteContext = {
  params: Promise<{
    scheduleId: string;
  }>;
};

type UpdateContactScheduleRequest = {
  scheduledAt?: string;
  memo?: string;
  completed?: boolean;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { scheduleId } = await context.params;

  const body = (await request.json()) as UpdateContactScheduleRequest;

  const schedule = await prisma.contact_schedules.update({
    where: {
      id: scheduleId,
    },

    data: {
      ...(body.scheduledAt && {
        scheduled_at: new Date(body.scheduledAt),
      }),

      ...(body.memo !== undefined && {
        memo: body.memo,
      }),

      ...(body.completed !== undefined && {
        completed: body.completed,

        completed_at: body.completed ? new Date() : null,
      }),
    },
  });

  return NextResponse.json({
    success: true,
    data: schedule,
  });
}

export async function DELETE(_: NextRequest, context: RouteContext) {
  const { scheduleId } = await context.params;

  await prisma.contact_schedules.delete({
    where: {
      id: scheduleId,
    },
  });

  return NextResponse.json({
    success: true,
  });
}
