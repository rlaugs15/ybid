import { queryOptions } from "@tanstack/react-query";
import { contractApi } from "../api/contract-api";
import { contractKeys } from "../query-keys";

export const contractOptions = {
  monthly: (params: { year: number; month: number; ownerId?: string }) =>
    queryOptions({
      queryKey: contractKeys.monthly(params.year, params.month),
      queryFn: () => contractApi.getMonthlyContracts(params.year, params.month),
      staleTime: 1000 * 60 * 3,
    }),
};
