"use server";

import { createClient } from "@/lib/supabase/server";
import { Provider } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

const signInWith = (provider: Provider) => async () => {
  const supabase = await createClient();

  const auth_callback_url = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: auth_callback_url,
    },
  });
  if (error) {
    console.log(error);
  }

  //Supabase OAuth처럼 외부 URL은 next-intl의 redirect()을 사용하지 않는다.
  redirect(data.url as string);
};

const signInWithGoogle = signInWith("google");
const signInWithKakao = signInWith("kakao");

export { signInWithGoogle, signInWithKakao };
