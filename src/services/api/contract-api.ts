export const contractApi = {
  getMonthlyContracts: async (year: number, month: number) => {
    const res = await fetch(`/api/contracts/monthly?year=${year}&month=${month}`);

    return res.json();
  },
};
