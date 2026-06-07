import { queryOptions } from "@tanstack/react-query";
import { getContactHistories } from "../actions/contact-history";
import { contactHistoryKeys } from "../query-keys";

export const contactHistoryQueries = {
  list: (companyId: string) =>
    queryOptions({
      queryKey: contactHistoryKeys.list(companyId),

      queryFn: () => getContactHistories(companyId),
    }),
};
