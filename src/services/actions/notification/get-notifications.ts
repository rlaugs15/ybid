import { fetcher } from "@/services/fetcher";

export async function getNotifications(userId: string) {
  const searchParams = new URLSearchParams({
    userId,
  });

  return fetcher(`/api/notifications?${searchParams.toString()}`);
}
