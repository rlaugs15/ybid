import { SupabaseClient } from "@supabase/supabase-js";
import prisma from "prisma/prisma";

export async function upsertGoogleUser(supabase: SupabaseClient<any, "public", any>) {
  /* 로그인된 유저 정보 가져오기 (auth.users 기준) */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const userProfile = await prisma.users.upsert({
    where: { id: user.id },
    update: {}, // 로그인 시마다 구글 정보 가져오기 싫어서 비워둠
    create: {
      id: user.id,
      email: user.email!,
      name: user.user_metadata.name,
    },
  });

  return userProfile;
}
