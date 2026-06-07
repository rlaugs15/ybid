import { fetcher } from "@/services/fetcher";
import { CreateContactScheduleRequest } from "@/types/contact-schedule";

export async function createContactSchedule(input: CreateContactScheduleRequest) {
  return fetcher("/api/contact-schedules", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
