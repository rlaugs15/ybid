import { fetcher } from "@/services/fetcher";
import { ContactScheduleParams } from "@/types/contact-schedule";

export async function getContactSchedules(params?: ContactScheduleParams) {
  const searchParams = new URLSearchParams();

  if (params?.type) {
    searchParams.set("type", params.type);
  }

  if (params?.date) {
    searchParams.set("date", params.date);
  }

  return fetcher(`/api/contact-schedules?${searchParams.toString()}`);
}
