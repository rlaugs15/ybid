import { queryOptions } from "@tanstack/react-query";
import { companyApi } from "../api/company-api";
import { companyKeys } from "../query-keys";

export const companyOptions = {
  list: (params?: {
    scope?: string;
    keyword?: string;
    interestLevel?: string;
    salesStatus?: string;
    isContracted?: boolean;
  }) =>
    queryOptions({
      queryKey: companyKeys.list(params),

      queryFn: () => companyApi.getCompanies(params),

      staleTime: 1000 * 60 * 5,
    }),

  detail: (companyId: string) =>
    queryOptions({
      queryKey: companyKeys.detail(companyId),

      queryFn: () => companyApi.getCompany(companyId),

      staleTime: 1000 * 60 * 5,
    }),
};
