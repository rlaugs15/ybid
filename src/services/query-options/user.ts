import { queryOptions } from "@tanstack/react-query";
import { getMe } from "../actions/user/get-me";
import { userKeys } from "../query-keys";

export const userQueries = {
  me: () =>
    queryOptions({
      queryKey: userKeys.me(),

      queryFn: getMe,
    }),
};
