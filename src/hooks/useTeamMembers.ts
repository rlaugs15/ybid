import { teamApi } from "@/services/api/team-api";
import { teamKeys } from "@/services/query-keys";
import { useQuery } from "@tanstack/react-query";

const useTeamMembers = (year: number, month: number) => {
  return useQuery({
    queryKey: teamKeys.members(year, month),

    queryFn: () => teamApi.getMembers(year, month),
  });
};
export default useTeamMembers;
