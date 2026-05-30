import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { upsertGoogleUser } from "./auth";

/* OAuth 로그인 후 리디렉션된 사용자를 처리하는 서버 핸들러 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code"); // Supabase가 넘긴 인증 코드
  const next = searchParams.get("next") ?? "/"; // 로그인 후 이동할 경로
  if (code) {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      /* 최초 로그인 시만 유저 정보를 user 스키마에 저장 (중복 생성 방지) */
      await upsertGoogleUser(supabase);
      /* 로그인 성공 → 환경에 따라 적절한 리디렉션 처리 */
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
