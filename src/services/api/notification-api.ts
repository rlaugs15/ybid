export const notificationApi = {
  getNotifications: async () => {
    const res = await fetch("/api/notifications");

    return res.json();
  },
};
