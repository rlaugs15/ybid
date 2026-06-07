import { fetcher } from "@/services/fetcher";

export async function deleteMonthlyTopSales(year: number, month: number) {
  const searchParams = new URLSearchParams({
    year: String(year),
    month: String(month),
  });

  return fetcher(`/api/monthly-top-sales?${searchParams.toString()}`, {
    method: "DELETE",
  });
}
