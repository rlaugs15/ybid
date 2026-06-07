import { contractQueries } from "@/services/query-options/contract";
import { useQuery } from "@tanstack/react-query";

export default function useMonthlyContracts(year: number, month: number) {
  return useQuery(contractQueries.monthly(year, month));
}
