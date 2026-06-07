import { updateCompanyContract } from "@/services/actions/contract";
import { companyKeys, contractKeys, dashboardKeys, notificationKeys } from "@/services/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/* 사용예시
const contractMutation =
  useUpdateCompanyContract();

contractMutation.mutate({
  companyId,
  action: "complete",
  memo: "대표 계약 완료",
}); 

contractMutation.mutate({
  companyId,
  action: "cancel",
});*/

export default function useUpdateCompanyContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      companyId,
      action,
      memo,
    }: {
      companyId: string;
      action: "complete" | "cancel";
      memo?: string;
    }) =>
      updateCompanyContract(companyId, {
        action,
        memo,
      }),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: companyKeys.detail(variables.companyId),
      });

      queryClient.invalidateQueries({
        queryKey: companyKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: contractKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: dashboardKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
  });
}
