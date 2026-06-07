import { upsertMonthlyTopSales } from "@/services/actions/monthly-top-sales";
import { monthlyTopSalesKeys } from "@/services/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useUpdateMonthlyTopSales() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upsertMonthlyTopSales,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: monthlyTopSalesKeys.current(variables.year, variables.month),
      });
    },
  });
}
