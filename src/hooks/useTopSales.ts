import { topSalesApi } from "@/services/api/top-sales-api";
import { topSalesKeys } from "@/services/query-keys";
import { useQuery } from "@tanstack/react-query";

const useTopSales = (year: number, month: number) => {
  return useQuery({
    queryKey: topSalesKeys.all,

    queryFn: () => topSalesApi.getTopSales(year, month),
  });
};
export default useTopSales;
