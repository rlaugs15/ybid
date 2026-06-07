import { notificationQueries } from "@/services/query-options/notification";
import { useQuery } from "@tanstack/react-query";

export default function useUnreadNotificationCount(userId: string) {
  return useQuery(notificationQueries.unreadCount(userId));
}
