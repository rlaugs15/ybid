import { fetcher } from "@/services/fetcher";

type UpdateMeRequest = {
  name?: string;
};

export async function updateMe(input: UpdateMeRequest) {
  return fetcher("/api/users/me", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}
