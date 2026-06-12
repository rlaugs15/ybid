import { fetcher } from "@/services/fetcher";
import { User } from "@/types/users";

export async function getMe(): Promise<User> {
  return fetcher("/api/users/me");
}
