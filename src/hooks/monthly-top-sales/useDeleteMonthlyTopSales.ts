import { deleteMonthlyTopSales } from "@/services/actions/monthly-top-sales";
import { monthlyTopSalesKeys } from "@/services/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useDeleteMonthlyTopSales() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ year, month }: { year: number; month: number }) =>
      deleteMonthlyTopSales(year, month),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: monthlyTopSalesKeys.current(variables.year, variables.month),
      });
    },
  });
}
