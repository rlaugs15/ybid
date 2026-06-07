import { updateCompany } from "@/services/actions/company";
import { companyKeys } from "@/services/query-keys";
import { UpdateCompanyRequest } from "@/types/company";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useUpdateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ companyId, input }: { companyId: string; input: UpdateCompanyRequest }) =>
      updateCompany(companyId, input),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: companyKeys.detail(variables.companyId),
      });

      queryClient.invalidateQueries({
        queryKey: companyKeys.lists(),
      });
    },
  });
}
