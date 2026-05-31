"use server";

import { createClient } from "@/lib/supabase/server";
import { cacheTag, revalidateTag } from "next/cache";
import prisma from "prisma/prisma";
import { CACHE_TAGS } from "../cache-tags";

export async function fetchUserSupabase() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

async function getCachedUser(userId: string) {
  "use cache";

  cacheTag(CACHE_TAGS.ME);

  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      team_id: true,
    },
  });

  return user ?? null;
}

export async function getUser() {
  const userId = await fetchUserSupabase();
  if (!userId) return null;

  return getCachedUser(userId);
}

// ===================================================================
// 로그아웃
// ===================================================================
export async function logout() {
  const supabase = await createClient();

  try {
    await supabase.auth.signOut();
    // 서버 캐시 무효화
    revalidateTag(CACHE_TAGS.ME, "none"); // use cache로 캐싱된 사용자 상태 즉시 갱신
  } catch (error) {
    console.error("로그아웃 실패:", error);
  }
}
