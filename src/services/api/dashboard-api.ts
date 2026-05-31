export const dashboardApi = {
  getDashboard: async () => {
    const res = await fetch("/api/dashboard");

    return res.json();
  },
};
