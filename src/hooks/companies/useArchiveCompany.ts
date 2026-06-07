import { archiveCompany } from "@/services/actions/company";
import { companyKeys } from "@/services/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useArchiveCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveCompany,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: companyKeys.lists(),
      });
    },
  });
}
