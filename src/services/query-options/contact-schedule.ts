import { ContactScheduleParams } from "@/types/contact-schedule";
import { queryOptions } from "@tanstack/react-query";
import { getContactScheduleCalendar, getContactSchedules } from "../actions/contact-schedule";
import { contactScheduleKeys } from "../query-keys";

export const contactScheduleQueries = {
  list: (params?: ContactScheduleParams) =>
    queryOptions({
      queryKey: contactScheduleKeys.list(params),

      queryFn: () => getContactSchedules(params),
    }),

  calendar: (year: number, month: number) =>
    queryOptions({
      queryKey: contactScheduleKeys.calendar(year, month),

      queryFn: () =>
        getContactScheduleCalendar({
          year,
          month,
        }),
    }),
};
