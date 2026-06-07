import { fetcher } from "@/services/fetcher";
import { CreateContactHistoryRequest } from "@/types/contact-history";

export async function createContactHistory(companyId: string, input: CreateContactHistoryRequest) {
  return fetcher(`/api/companies/${companyId}/contact-histories`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}
