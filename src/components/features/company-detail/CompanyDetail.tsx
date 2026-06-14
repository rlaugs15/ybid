"use client";

import FallbackMessage from "@/components/common/FallbackMessage";
import Loading from "@/components/common/Loading";
import useCompany from "@/hooks/companies/useCompany";
import { useParams } from "next/navigation";
import CompanyBasicInfo from "./CompanyBasicInfo";
import CompanyBusinessInfo from "./CompanyBusinessInfo";
import CompanyHeader from "./CompanyHeader";
import CompanyManagerInfo from "./CompanyManagerInfo";
import CompanySalesInfo from "./CompanySalesInfo";

export default function CompanyDetail() {
  const { companyId } = useParams<{ companyId: string }>();
  const { data: company, isPending } = useCompany(companyId);

  if (isPending) {
    return <Loading />;
  }

  if (!company) {
    return <FallbackMessage message="업체를 찾을 수 없습니다." />;
  }
  return (
    <div className="space-y-8 pb-10">
      {/* 헤더 */}
      <CompanyHeader company={company} />

      {/* 기본 정보 */}
      <CompanyBasicInfo company={company} />

      {/* 담당자 정보 */}
      <CompanyManagerInfo
        manager_name={String(company.manager_name)}
        manager_phone={String(company.manager_phone)}
      />

      {/* 공사업 정보 */}
      <CompanyBusinessInfo business_licenses={company.business_licenses} />

      {/* 영업 정보 */}
      <CompanySalesInfo {...company} />
    </div>
  );
}
