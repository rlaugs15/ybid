import { queryOptions } from "@tanstack/react-query";
import { getMonthlyTopSales } from "../actions/monthly-top-sales";
import { monthlyTopSalesKeys } from "../query-keys";

export const monthlyTopSalesQueries = {
  current: (year: number, month: number) =>
    queryOptions({
      queryKey: monthlyTopSalesKeys.current(year, month),

      queryFn: () =>
        getMonthlyTopSales({
          year,
          month,
        }),
    }),
};
