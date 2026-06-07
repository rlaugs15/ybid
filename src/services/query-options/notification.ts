import { queryOptions } from "@tanstack/react-query";
import { getNotifications, getUnreadNotificationCount } from "../actions/notification";
import { notificationKeys } from "../query-keys";

export const notificationQueries = {
  list: (userId: string) =>
    queryOptions({
      queryKey: notificationKeys.list(userId),

      queryFn: () => getNotifications(userId),
    }),

  unreadCount: (userId: string) =>
    queryOptions({
      queryKey: notificationKeys.unreadCount(userId),

      queryFn: () => getUnreadNotificationCount(userId),
    }),
};
