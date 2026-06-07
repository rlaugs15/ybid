import { updateContactSchedule } from "@/services/actions/contact-schedule";
import { companyKeys, contactScheduleKeys, dashboardKeys } from "@/services/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useUpdateContactSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      scheduleId,
      input,
    }: {
      scheduleId: string;
      input: {
        scheduledAt?: string;
        memo?: string;
        completed?: boolean;
      };
    }) => updateContactSchedule(scheduleId, input),

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
