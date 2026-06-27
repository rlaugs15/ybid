import { fetcher } from "@/services/fetcher";
import { CreateCompanyRequest } from "@/types/company";

type CreateCompanyResponse = {
  id: string;
};

export async function createCompany(input: CreateCompanyRequest) {
  return fetcher<CreateCompanyResponse>("/api/companies", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
