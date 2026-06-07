import { fetcher } from "@/services/fetcher";

export async function deleteContactSchedule(scheduleId: string) {
  return fetcher(`/api/contact-schedules/${scheduleId}`, {
    method: "DELETE",
  });
}
