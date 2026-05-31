import { notificationApi } from "@/services/api/notification-api";
import { notificationKeys } from "@/services/query-keys";
import { useQuery } from "@tanstack/react-query";

const useNotifications = () => {
  return useQuery({
    queryKey: notificationKeys.all,

    queryFn: notificationApi.getNotifications,
  });
};

export default useNotifications;
