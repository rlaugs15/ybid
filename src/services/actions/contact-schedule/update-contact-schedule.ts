import { fetcher } from "@/services/fetcher";
import { UpdateContactScheduleRequest } from "@/types/contact-schedule";

export async function updateContactSchedule(
  scheduleId: string,
  input: UpdateContactScheduleRequest,
) {
  return fetcher(`/api/contact-schedules/${scheduleId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}
