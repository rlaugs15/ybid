import { fetcher } from "@/services/fetcher";
import { UpdateCompanyRequest } from "@/types/company";

export async function updateCompany(companyId: string, input: UpdateCompanyRequest) {
  return fetcher(`/api/companies/${companyId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}
