import { fetcher } from "@/services/fetcher";
import { DashboardResponse } from "@/types/dashboard";

export async function getDashboard(userId: string): Promise<DashboardResponse> {
  const searchParams = new URLSearchParams({
    userId,
  });

  return fetcher(`/api/dashboard?${searchParams.toString()}`);
}
