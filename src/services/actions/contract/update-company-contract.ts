import { fetcher } from "@/services/fetcher";
import { UpdateCompanyContractRequest } from "@/types/contract";

export async function updateCompanyContract(
  companyId: string,
  input: UpdateCompanyContractRequest,
) {
  return fetcher(`/api/companies/${companyId}/contract`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}
