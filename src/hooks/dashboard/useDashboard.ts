import { dashboardQueries } from "@/services/query-options/dashboard";
import { useQuery } from "@tanstack/react-query";

export function useDashboard(userId: string) {
  return useQuery(dashboardQueries.summary(userId));
}
