import { fetcher } from "@/services/fetcher";

export async function getContactHistories(companyId: string) {
  return fetcher(`/api/companies/${companyId}/contact-histories`);
}
