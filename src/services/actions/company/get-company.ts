import { fetcher } from "@/services/fetcher";

export async function getCompany(companyId: string) {
  return fetcher(`/api/companies/${companyId}`);
}
