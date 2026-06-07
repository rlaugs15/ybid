import { fetcher } from "@/services/fetcher";
import { MonthlyContractParams } from "@/types/contract";

export async function getMonthlyContracts(params: MonthlyContractParams) {
  const searchParams = new URLSearchParams({
    year: String(params.year),
    month: String(params.month),
  });

  return fetcher(`/api/contracts/monthly?${searchParams.toString()}`);
}
