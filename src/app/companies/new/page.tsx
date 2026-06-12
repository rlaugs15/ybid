import CompanyForm from "@/components/features/companies/new/CompanyForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";

export default function NewCompanyPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-display font-bold">업체 등록</h1>
        <p className="mt-1 font-semibold text-gray-500">새로운 영업 업체를 등록하세요.</p>
      </section>

      <Card className="max-w-5xl rounded-2xl border border-gray-100 shadow-lg">
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense>
            <CompanyForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
