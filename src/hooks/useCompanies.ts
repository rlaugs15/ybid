import { companyApi } from "@/services/api/company-api";
import { companyKeys } from "@/services/query-keys";
import { useQuery } from "@tanstack/react-query";

const useCompanies = (params?: { scope?: string; keyword?: string }) => {
  return useQuery({
    queryKey: companyKeys.list(params),

    queryFn: () => companyApi.getCompanies(params),
  });
};

export default useCompanies;
