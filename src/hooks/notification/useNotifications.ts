import { notificationQueries } from "@/services/query-options/notification";
import { useQuery } from "@tanstack/react-query";

export default function useNotifications(userId: string) {
  return useQuery(notificationQueries.list(userId));
}
