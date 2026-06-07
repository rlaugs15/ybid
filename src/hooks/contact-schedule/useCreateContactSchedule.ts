import { createContactSchedule } from "@/services/actions/contact-schedule";
import { companyKeys, contactScheduleKeys, dashboardKeys } from "@/services/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useCreateContactSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createContactSchedule,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contactScheduleKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: dashboardKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: companyKeys.all,
      });
    },
  });
}
