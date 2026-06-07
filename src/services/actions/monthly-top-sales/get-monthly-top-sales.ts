import { fetcher } from "@/services/fetcher";
import { MonthlyTopSalesParams } from "@/types/monthly-top-sales";

export async function getMonthlyTopSales(params: MonthlyTopSalesParams) {
  const searchParams = new URLSearchParams({
    year: String(params.year),
    month: String(params.month),
  });

  return fetcher(`/api/monthly-top-sales?${searchParams.toString()}`);
}
