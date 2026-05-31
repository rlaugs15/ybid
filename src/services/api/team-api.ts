export const teamApi = {
  getMembers: async (year: number, month: number) => {
    const res = await fetch(`/api/team/members?year=${year}&month=${month}`);

    return res.json();
  },
};
