## API 요약 예시

app/api/companies/route.ts

- GET: 업체 목록 조회
- POST: 업체 등록

app/api/companies/[companyId]/route.ts

- GET: 업체 상세 조회
- PATCH: 업체 수정
- DELETE: 업체 삭제 또는 보관 처리

app/api/companies/[companyId]/contract/route.ts

- PATCH: 계약 완료 / 계약 취소 처리

app/api/companies/[companyId]/contact-histories/route.ts

- GET: 연락 기록 조회
- POST: 연락 기록 추가

app/api/contact-schedules/route.ts

- GET: 연락 예정 목록 조회

app/api/contact-schedules/calendar/route.ts

- GET: 월별 날짜별 연락 예정 업체 수 조회

app/api/contracts/monthly/route.ts

- GET: 월별 계약 완료 현황 조회

app/api/dashboard/route.ts

- GET: 대시보드 요약 데이터 조회

app/api/monthly-top-sales/route.ts

- GET: 헤더 1등 직원 조회
- POST: 1등 직원 등록/수정

app/api/notifications/route.ts

- GET: 알림 목록 조회

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
