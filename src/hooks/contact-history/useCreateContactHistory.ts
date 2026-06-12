import { createContactHistory } from "@/services/actions/contact-history";
import {
  companyKeys,
  contactHistoryKeys,
  contactScheduleKeys,
  dashboardKeys,
} from "@/services/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/* 사용예시
mutation.mutate({
  companyId,

  input: {
    content:
      "전화 상담 진행. 다음 주 재연락 예정",

    userId,

    nextContactDate:
      "2026-06-20",

    nextContactMemo:
      "견적서 전달 예정",
  },
}); */

export default function useCreateContactHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      companyId,
      input,
    }: {
      companyId: string;
      input: {
        content: string;
        nextContactDate?: string;
        nextContactMemo?: string;
      };
    }) => createContactHistory(companyId, input),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: contactHistoryKeys.list(variables.companyId),
      });

      queryClient.invalidateQueries({
        queryKey: companyKeys.detail(variables.companyId),
      });

      queryClient.invalidateQueries({
        queryKey: contactScheduleKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: dashboardKeys.all,
      });
    },
  });
}
