import { contactScheduleQueries } from "@/services/query-options/contact-schedule";
import { useQuery } from "@tanstack/react-query";

export default function useContactScheduleCalendar(year: number, month: number) {
  return useQuery(contactScheduleQueries.calendar(year, month));
}
