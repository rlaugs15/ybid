import Loading from "@/components/common/Loading";
import CompanyDetail from "@/components/features/company-detail/CompanyDetail";
import { Suspense } from "react";

export default async function CompanyDetailPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CompanyDetail />
    </Suspense>
  );
}
