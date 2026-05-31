import { contractApi } from "@/services/api/contract-api";
import { contractKeys } from "@/services/query-keys";
import { useQuery } from "@tanstack/react-query";

const useMonthlyContracts = (year: number, month: number) => {
  return useQuery({
    queryKey: contractKeys.monthly(year, month),

    queryFn: () => contractApi.getMonthlyContracts(year, month),
  });
};

export default useMonthlyContracts;
