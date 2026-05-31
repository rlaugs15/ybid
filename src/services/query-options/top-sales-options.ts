import { queryOptions } from "@tanstack/react-query";
import { topSalesApi } from "../api/top-sales-api";
import { topSalesKeys } from "../query-keys";

export const topSalesOptions = {
  current: (params: { year: number; month: number }) =>
    queryOptions({
      queryKey: topSalesKeys.current(params.year, params.month),
      queryFn: () => topSalesApi.getTopSales(params.year, params.month),
      staleTime: 1000 * 60 * 5,
    }),
};
