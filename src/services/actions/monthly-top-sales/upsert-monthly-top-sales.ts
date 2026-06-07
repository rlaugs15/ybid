import { fetcher } from "@/services/fetcher";
import { UpsertMonthlyTopSalesRequest } from "@/types/monthly-top-sales";

export async function upsertMonthlyTopSales(input: UpsertMonthlyTopSalesRequest) {
  return fetcher("/api/monthly-top-sales", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
