import PageHeader from "@/components/common/PageHeader";
import MyCompaniesClient from "@/components/features/my-companies/MyCompaniesClient";

export default function MyCompaniesPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        title="내 업체 관리"
        description="내가 담당하고 있는 업체 목록을 확인하고 관리할 수 있습니다."
      />
      <MyCompaniesClient />
    </div>
  );
}
