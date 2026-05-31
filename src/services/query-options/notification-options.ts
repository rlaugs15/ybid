import { queryOptions } from "@tanstack/react-query";
import { notificationApi } from "../api/notification-api";
import { notificationKeys } from "../query-keys";

export const notificationOptions = {
  list: () =>
    queryOptions({
      queryKey: notificationKeys.all,
      queryFn: notificationApi.getNotifications,
      staleTime: 1000 * 30,
    }),
};
