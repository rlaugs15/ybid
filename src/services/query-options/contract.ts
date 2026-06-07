import { queryOptions } from "@tanstack/react-query";
import { getMonthlyContracts } from "../actions/contract";
import { contractKeys } from "../query-keys";

export const contractQueries = {
  monthly: (year: number, month: number) =>
    queryOptions({
      queryKey: contractKeys.monthly(year, month),

      queryFn: () =>
        getMonthlyContracts({
          year,
          month,
        }),
    }),
};
