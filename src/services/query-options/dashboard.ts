import { queryOptions } from "@tanstack/react-query";
import { getDashboard } from "../actions/dashboard";
import { dashboardKeys } from "../query-keys";

export const dashboardQueries = {
  summary: (userId: string) =>
    queryOptions({
      queryKey: dashboardKeys.summary(userId),

      queryFn: () => getDashboard(userId),

      enabled: !!userId,
      refetchOnMount: "always",
    }),
};
