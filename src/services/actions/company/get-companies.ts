import { fetcher } from "@/services/fetcher";
import { CompanyListParams } from "@/types/company";

export async function getCompanies(params?: CompanyListParams) {
  const searchParams = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, String(value));
    }
  });

  return fetcher(`/api/companies?${searchParams.toString()}`);
}
