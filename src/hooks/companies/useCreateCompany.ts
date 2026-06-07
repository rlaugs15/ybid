import { createCompany } from "@/services/actions/company";
import { companyKeys } from "@/services/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCompany,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: companyKeys.lists(),
      });
    },
  });
}
