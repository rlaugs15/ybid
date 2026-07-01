import { queryOptions } from "@tanstack/react-query";
import { getCompanies, getCompany } from "../actions/company";
import { companyKeys } from "../query-keys";

export const companyQueries = {
  list: (params?: Record<string, unknown>) =>
    queryOptions({
      queryKey: companyKeys.list(params),

      queryFn: () => getCompanies(params),
      enabled: !!params?.ownerId,
      placeholderData: (previousData) => previousData,
      gcTime: 0,
    }),

  detail: (companyId: string) =>
    queryOptions({
      queryKey: companyKeys.detail(companyId),

      queryFn: () => getCompany(companyId),

      enabled: !!companyId,
    }),
};
