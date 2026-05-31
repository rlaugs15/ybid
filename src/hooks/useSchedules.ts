import { scheduleApi } from "@/services/api/schedule-api";
import { scheduleKeys } from "@/services/query-keys";
import { useQuery } from "@tanstack/react-query";

const useSchedules = (params: { date?: string; status?: string }) => {
  return useQuery({
    queryKey: scheduleKeys.list(params),

    queryFn: () => scheduleApi.getSchedules(params),
  });
};

export default useSchedules;
