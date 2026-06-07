import { contactScheduleQueries } from "@/services/query-options/contact-schedule";
import { ContactScheduleParams } from "@/types/contact-schedule";
import { useQuery } from "@tanstack/react-query";

export default function useContactSchedules(params?: ContactScheduleParams) {
  return useQuery(contactScheduleQueries.list(params));
}
