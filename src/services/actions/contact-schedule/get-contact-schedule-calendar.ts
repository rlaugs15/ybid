import { fetcher } from "@/services/fetcher";
import { CalendarParams } from "@/types/contact-schedule";

export async function getContactScheduleCalendar(params: CalendarParams) {
  const searchParams = new URLSearchParams({
    year: String(params.year),
    month: String(params.month),
  });

  return fetcher(`/api/contact-schedules/calendar?${searchParams.toString()}`);
}
