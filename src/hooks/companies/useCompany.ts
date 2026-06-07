import { companyQueries } from "@/services/query-options/company";
import { useQuery } from "@tanstack/react-query";

export default function useCompany(companyId: string) {
  return useQuery(companyQueries.detail(companyId));
}
