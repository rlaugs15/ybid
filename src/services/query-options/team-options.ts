import { queryOptions } from "@tanstack/react-query";
import { teamApi } from "../api/team-api";
import { teamKeys } from "../query-keys";

export const teamOptions = {
  members: (params: { year: number; month: number; teamId?: string }) =>
    queryOptions({
      queryKey: teamKeys.members(params.year, params.month, params.teamId),
      queryFn: () => teamApi.getMembers(params.year, params.month),
      staleTime: 1000 * 60 * 3,
    }),
};
