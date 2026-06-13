"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300_000, // 조회 후 5분 동안 fresh 상태로 간주
      gcTime: 10 * 60 * 1000, // 사용하지 않는 캐시를 10분 동안 메모리에 보관
      refetchOnMount: true, // 컴포넌트가 마운트될 때 데이터가 stale이면 자동으로 재조회
      refetchOnWindowFocus: true, // 브라우저 탭으로 돌아왔을 때 데이터가 stale이면 자동으로 재조회
      refetchOnReconnect: true, // 네트워크가 다시 연결되었을 때 데이터가 stale이면 자동으로 재조회
      retry: 2, // 요청 실패 시 최대 2번 재시도
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
