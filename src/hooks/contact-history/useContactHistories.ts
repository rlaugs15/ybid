import { contactHistoryQueries } from "@/services/query-options/contact-history";
import { useQuery } from "@tanstack/react-query";

export default function useContactHistories(companyId: string) {
  return useQuery(contactHistoryQueries.list(companyId));
}
