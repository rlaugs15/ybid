import { readNotification } from "@/services/actions/notification";
import { notificationKeys } from "@/services/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useReadNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ notificationId, userId }: { notificationId: string; userId: string }) =>
      readNotification(notificationId, userId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.list(variables.userId),
      });

      queryClient.invalidateQueries({
        queryKey: notificationKeys.unreadCount(variables.userId),
      });
    },
  });
}
