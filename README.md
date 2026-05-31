## API 요약 예시

// 내 업체 목록
GET /api/companies?scope=mine

// 전체 영업 현황
GET /api/companies?scope=all

// 관심도 높음만 조회
GET /api/companies?interestLevel=high

// 계약 전 업체만 조회
GET /api/companies?isContracted=false

// 특정 날짜 연락 예정
GET /api/contacts/schedules?date=2026-05-22

// 지난 연락 미처리
GET /api/contacts/schedules?status=overdue

// 2026년 5월 계약 완료 현황
GET /api/contracts/monthly?year=2026&month=5

// 특정 직원의 2026년 5월 계약 완료 현황
GET /api/contracts/monthly?year=2026&month=5&ownerId=USER_ID

// 팀원별 현황
GET /api/team/members?year=2026&month=5

// 1등 직원 조회
GET /api/top-sales?year=2026&month=5

## 업체 수정 시 캐시 무효화

```typescript
revalidateTag(CACHE_TAGS.COMPANY);

revalidateTag(CACHE_TAGS.COMPANY_LIST);

revalidateTag(CACHE_TAGS.DASHBOARD);

revalidateTag(CACHE_TAGS.SCHEDULE);
```

## 계약 완료 시 캐시 무효화

```typescript
revalidateTag(CACHE_TAGS.COMPANY);

revalidateTag(CACHE_TAGS.COMPANY_LIST);

revalidateTag(CACHE_TAGS.CONTRACT);

revalidateTag(CACHE_TAGS.CONTRACT_MONTHLY);

revalidateTag(CACHE_TAGS.DASHBOARD);

revalidateTag(CACHE_TAGS.TOP_SALES);

revalidateTag(CACHE_TAGS.NOTIFICATION);
```

## query-options 사용 예시

```typescript
"use client";

import { useQuery } from "@tanstack/react-query";
import { companyOptions } from "@/lib/query-options/company-options";

export function MyCompanyList() {
  const { data, isLoading } = useQuery(
    companyOptions.list({
      scope: "mine",
      isContracted: false,
    })
  );

  if (isLoading) return <div>로딩 중</div>;

  return <div>{data?.length}개</div>;
}
```

서버 프리패치에서는 이렇게 쓴다.

```typescript
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { companyOptions } from "@/lib/query-options/company-options";
import { MyCompanyList } from "./MyCompanyList";

export default async function Page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    companyOptions.list({
      scope: "mine",
      isContracted: false,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyCompanyList />
    </HydrationBoundary>
  );
}
```

query-options:

- 클라이언트 useQuery, 서버 prefetchQuery에서 같이 쓰는 TanStack Query 설정

actions:

- 서버 컴포넌트나 API Route 내부에서 Prisma로 직접 DB 조회/수정할 때 쓰는 서버 함수
