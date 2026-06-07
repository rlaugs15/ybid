import { fetcher } from "@/services/fetcher";

export async function archiveCompany(companyId: string) {
  return fetcher(`/api/companies/${companyId}`, {
    method: "DELETE",
  });
}
