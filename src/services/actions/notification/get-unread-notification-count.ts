import { fetcher } from "@/services/fetcher";

export async function getUnreadNotificationCount(userId: string) {
  const searchParams = new URLSearchParams({
    userId,
  });

  return fetcher(`/api/notifications/unread-count?${searchParams.toString()}`);
}
