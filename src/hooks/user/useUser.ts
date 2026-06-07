import { userQueries } from "@/services/query-options/user";
import { useQuery } from "@tanstack/react-query";

export default function useUser() {
  return useQuery(userQueries.me());
}
