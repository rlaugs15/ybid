import { fetcher } from "@/services/fetcher";

export async function readNotification(notificationId: string, userId: string) {
  return fetcher(`/api/notifications/${notificationId}/read`, {
    method: "POST",
    body: JSON.stringify({
      userId,
    }),
  });
}
