import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useUser from "@/hooks/user/useUser";
import { formatDate } from "@/lib/utils";
import { CompanyDetail } from "@/types/company-detail";
import { Building2, Calendar, Pencil, User } from "lucide-react";
import Link from "next/link";
import InterestBadge from "./InterestBadge";
import SummaryCard from "./SummaryCard";
import ArchiveCompanyButton from "./button/ArchiveCompanyButton";

interface Props {
  company: CompanyDetail;
}

export default function CompanyHeader({ company }: Props) {
  const { data: me } = useUser();
  const nextSchedule = company.contact_schedules[0];
  return (
    <Card className="rounded-[32px] border border-slate-200 shadow-lg p-0">
      <CardContent className="space-y-10 bg-linear-to-br from-white to-slate-50 p-10">
        <div className="flex items-start justify-between">
          <div className="flex gap-5">
            <div className="flex h-28 w-28 items-center justify-center rounded-[32px] bg-linear-to-br from-blue-50 to-indigo-50">
              <Building2 className="h-14 w-14 text-blue-600" />
            </div>

            <div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                업체 정보
              </span>

              <div className="mt-3 flex items-center gap-4">
                <h1 className="text-5xl font-bold tracking-tight">{company.name}</h1>

                <InterestBadge level={company.interest_level} />
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                <Calendar size={16} />
                등록일 {formatDate(company.created_at)}
              </div>
            </div>
          </div>

          {/* 수정 삭제 버튼 */}
          {me?.id === company.owner_id ? (
            <div className="flex gap-3">
              <Button asChild variant="outline" className="h-12 rounded-2xl px-6">
                <Link href={`/companies/${company.id}/edit`}>
                  <Pencil size={16} />
                  수정
                </Link>
              </Button>

              <ArchiveCompanyButton companyId={company.id} />
            </div>
          ) : null}
        </div>

        {/* 정보 카드 영역 */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <SummaryCard
            label="담당 영업사원"
            value={company.users_companies_owner_idTousers.name}
            icon={
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                <User className="h-8 w-8 text-blue-600" />
              </div>
            }
          />

          {company.teams && (
            <SummaryCard
              label="소속 팀"
              value={company.teams.name}
              icon={
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-50">
                  <Building2 className="h-8 w-8 text-violet-600" />
                </div>
              }
            />
          )}

          <SummaryCard
            label="다음 연락일"
            value={nextSchedule ? formatDate(nextSchedule.scheduled_at) : "없음"}
            icon={
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                <Calendar className="h-8 w-8 text-emerald-600" />
              </div>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
