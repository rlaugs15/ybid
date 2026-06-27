import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { INTEREST_LEVEL_LABELS } from "@/constants/businessData";
import { cn, formatDate, getInterestTextStyle } from "@/lib/utils";
import { CompanyDetail } from "@/types/company-detail";
import { Calendar, Clock3, FileText, Handshake, Star } from "lucide-react";

type Props = Pick<
  CompanyDetail,
  | "interest_level"
  | "contracted_at"
  | "contract_duration_days"
  | "contract_memo"
  | "contact_schedules"
>;

export default function CompanySalesInfo({
  interest_level,
  contracted_at,
  contract_duration_days,
  contract_memo,
  contact_schedules,
}: Props) {
  const nextSchedule = contact_schedules[0];
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-bold text-2xl">
          <Clock3 className="h-6 w-6 text-blue-600" />
          영업 정보
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-hidden rounded-3xl border bg-white">
          {/* 상단 KPI */}
          <div className="grid md:grid-cols-4">
            <div className="flex gap-4 border-b p-6 md:border-r md:border-b-0">
              <Star
                className={cn(" h-6 w-6 text-amber-500", getInterestTextStyle(interest_level))}
              />

              <div>
                <p className="text-sm text-gray-500">관심도</p>
                <p className={cn("mt-2 text-xl font-bold", getInterestTextStyle(interest_level))}>
                  {INTEREST_LEVEL_LABELS[interest_level as keyof typeof INTEREST_LEVEL_LABELS]}
                </p>
              </div>
            </div>

            <div className="flex gap-4 border-b p-6 md:border-r md:border-b-0">
              <Calendar className="h-6 w-6 text-blue-500" />

              <div>
                <p className="text-sm text-gray-500">다음 연락일</p>

                <p className="mt-2 text-xl font-bold">
                  {nextSchedule ? formatDate(nextSchedule.scheduled_at) : "-"}
                </p>
              </div>
            </div>

            <div className="flex gap-4 border-b p-6 md:border-r md:border-b-0">
              <Handshake className="h-6 w-6 text-emerald-500" />

              <div>
                <p className="text-sm text-gray-500">계약일</p>

                <p className="mt-2 text-xl font-bold">
                  {contracted_at ? formatDate(contracted_at) : "-"}
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6">
              <Clock3 className="h-6 w-6 text-orange-500" />

              <div>
                <p className="text-sm text-gray-500">계약 소요 일수</p>

                <p className="mt-2 text-xl font-bold">
                  {contract_duration_days ? `${contract_duration_days}일` : "-"}
                </p>
              </div>
            </div>
          </div>

          {/* 계약 메모 */}
          <div className="flex gap-4 border-t p-6">
            <FileText className="h-6 w-6 text-emerald-500" />

            <div>
              <p className="text-sm text-gray-500">계약 메모</p>

              <p className="mt-2 whitespace-pre-wrap text-base">{contract_memo ?? "-"}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
