import { fetcher } from "@/services/fetcher";
import { CreateCompanyRequest } from "@/types/company";

export async function createCompany(input: CreateCompanyRequest) {
  return fetcher("/api/companies", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
