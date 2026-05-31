import { companyApi } from "@/services/api/company-api";
import { companyKeys } from "@/services/query-keys";
import { useQuery } from "@tanstack/react-query";

const useCompany = (companyId: string) => {
  return useQuery({
    queryKey: companyKeys.detail(companyId),

    queryFn: () => companyApi.getCompany(companyId),
  });
};

export default useCompany;
