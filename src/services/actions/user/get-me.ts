import { fetcher } from "@/services/fetcher";

export async function getMe() {
  return fetcher("/api/users/me");
}
