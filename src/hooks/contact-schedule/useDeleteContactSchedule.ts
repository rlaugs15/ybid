import { deleteContactSchedule } from "@/services/actions/contact-schedule";
import { companyKeys, contactScheduleKeys, dashboardKeys } from "@/services/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useDeleteContactSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scheduleId: string) => deleteContactSchedule(scheduleId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contactScheduleKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: companyKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: dashboardKeys.all,
      });
    },
  });
}
