import { fetcher } from "@/services/fetcher";
import { CompanyListParams, CompanySummary } from "@/types/company";

export async function getCompanies(params?: CompanyListParams): Promise<CompanySummary[]> {
  const searchParams = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, String(value));
    }
  });

  return fetcher(`/api/companies?${searchParams.toString()}`);
}
