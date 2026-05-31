import { queryOptions } from "@tanstack/react-query";
import { scheduleApi } from "../api/schedule-api";
import { scheduleKeys } from "../query-keys";

export const scheduleOptions = {
  list: (params: {
    scope?: "mine" | "all";
    date?: string;
    from?: string;
    to?: string;
    status?: "today" | "week" | "overdue" | "all";
  }) =>
    queryOptions({
      queryKey: scheduleKeys.list(params),
      queryFn: () => scheduleApi.getSchedules(params),
      staleTime: 1000 * 60,
    }),
};
