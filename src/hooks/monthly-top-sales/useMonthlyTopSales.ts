import { monthlyTopSalesQueries } from "@/services/query-options/monthly-top-sales";
import { useQuery } from "@tanstack/react-query";

export default function useMonthlyTopSales(year: number, month: number) {
  return useQuery(monthlyTopSalesQueries.current(year, month));
}
