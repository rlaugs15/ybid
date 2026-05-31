export const scheduleApi = {
  getSchedules: async (params: { date?: string; status?: string }) => {
    const query = new URLSearchParams();

    if (params.date) {
      query.set("date", params.date);
    }

    if (params.status) {
      query.set("status", params.status);
    }

    const res = await fetch(`/api/contacts/schedules?${query}`);

    return res.json();
  },
};
