import { Database } from "@/types/database.types";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // 응답 객체를 생성해서 이 안에 쿠키 정보 등을 저장할 예정
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // 브라우저에서 받은 쿠키를 요청과 응답 모두에 반영해서 세션 유지
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // 주의: createServerClient 다음에 getUser를 바로 호출해야 함
  // 그 사이에 다른 코드를 넣으면 세션이 꼬이거나 로그아웃 문제가 발생할 수 있음

  // auth.getUser() 절대 지우지 말 것: 이 함수는 단순히 유저 정보를 가져오는 것 외에도
  // 만료된 세션을 자동으로 갱신(refresh)해주는 역할을 함

  const pathname = request.nextUrl.pathname;

  // Supabase 인증 체크
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("PROXY USER", user?.id);
  console.log("PATH", pathname);

  // 로그인 페이지 접근 처리
  if (pathname === "/login") {
    // 이미 로그인한 경우 홈으로 이동
    if (user) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    // 비로그인 사용자는 로그인 페이지 허용
    return supabaseResponse;
  }

  // 로그인 안 된 경우 로그인 페이지로 이동
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;

  // 반드시 supabaseResponse를 그대로 반환해야 함
  // 만약 새로운 응답 객체를 만들 경우 다음을 지켜야 함:
  // 1. request 객체를 넣을 것 → const res = NextResponse.next({ request })
  // 2. supabaseResponse의 쿠키를 그대로 복사할 것 → res.cookies.setAll(...)
  // 3. 쿠키 정보는 절대 누락되지 않게 주의할 것
  // 4. 최종적으로 새로 만든 응답(res)을 반환할 것
}
