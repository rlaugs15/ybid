import { queryOptions } from "@tanstack/react-query";

export const dashboardKeys = {
  all: ["dashboard"] as const,
};

export const dashboardOptions = {
  summary: () =>
    queryOptions({
      queryKey: dashboardKeys.all,

      queryFn: async () => {
        const res = await fetch("/api/dashboard");

        return res.json();
      },

      staleTime: 1000 * 60,
    }),
};
