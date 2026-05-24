"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300_000, // 서버 stale과 맞춤
      gcTime: 10 * 60 * 1000, // 10분 보관
      refetchOnMount: false, // CSR 컴포넌트가 마운트될 때마다 무조건 refetch
      refetchOnWindowFocus: true, // 브라우저 탭으로 돌아올 때 데이터가 stale이면 refetch
      refetchOnReconnect: true, // 네트워크가 끊겼다가 다시 연결되면, 데이터가 stale이면 refetch
      retry: 2, // 요청 실패 시 최대 2번 재시도
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
