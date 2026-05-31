export const companyApi = {
  async getCompanies(params?: {
    scope?: string;
    keyword?: string;
    interestLevel?: string;
    salesStatus?: string;
    isContracted?: boolean;
  }) {
    const query = new URLSearchParams();

    if (params?.scope) query.set("scope", params.scope);

    if (params?.keyword) query.set("keyword", params.keyword);

    if (params?.interestLevel) query.set("interestLevel", params.interestLevel);

    if (params?.salesStatus) query.set("salesStatus", params.salesStatus);

    if (typeof params?.isContracted === "boolean") {
      query.set("isContracted", String(params.isContracted));
    }

    const res = await fetch(`/api/companies?${query.toString()}`);

    return res.json();
  },

  async getCompany(companyId: string) {
    const res = await fetch(`/api/companies/${companyId}`);

    return res.json();
  },
};
