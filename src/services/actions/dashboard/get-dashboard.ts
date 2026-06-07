import { fetcher } from "@/services/fetcher";

export async function getDashboard(userId: string) {
  const searchParams = new URLSearchParams({
    userId,
  });

  return fetcher(`/api/dashboard?${searchParams.toString()}`);
}
