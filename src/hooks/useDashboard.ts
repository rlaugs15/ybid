import { dashboardApi } from "@/services/api/dashboard-api";
import { dashboardKeys } from "@/services/query-keys";
import { useQuery } from "@tanstack/react-query";

const useDashboard = () => {
  return useQuery({
    queryKey: dashboardKeys.all,

    queryFn: dashboardApi.getDashboard,
  });
};

export default useDashboard;
