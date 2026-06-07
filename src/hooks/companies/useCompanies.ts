import { companyQueries } from "@/services/query-options/company";
import { CompanyListParams } from "@/types/company";
import { useQuery } from "@tanstack/react-query";

export default function useCompanies(params?: CompanyListParams) {
  return useQuery(companyQueries.list(params));
}
