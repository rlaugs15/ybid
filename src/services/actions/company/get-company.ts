import { fetcher } from "@/services/fetcher";
import { CompanyDetail } from "@/types/company-detail";

export async function getCompany(companyId: string): Promise<CompanyDetail> {
  return fetcher(`/api/companies/${companyId}`);
}
