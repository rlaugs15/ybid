export const topSalesApi = {
  getTopSales: async (year: number, month: number) => {
    const res = await fetch(`/api/top-sales?year=${year}&month=${month}`);

    return res.json();
  },
};
