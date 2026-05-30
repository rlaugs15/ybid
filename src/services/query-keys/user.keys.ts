import { cacheCore, safeKey } from "@/lib/utils";

export const userKeys = {
  all: ["user"] as const,

  // 현재 로그인한 유저 정보
  me: () => safeKey(...userKeys.all, "me"),

  // 특정 유저 공개 프로필 정보
  publicUser: (userId: string) => safeKey(...userKeys.all, "public", userId),
};

export const userTags = {
  me: () => cacheCore.fromKey(userKeys.me()),
  publicUser: (id: string) => cacheCore.fromKey(userKeys.publicUser(id)),
};
