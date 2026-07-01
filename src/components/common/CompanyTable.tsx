"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { INTEREST_LEVEL_LABELS } from "@/constants/businessData";
import { formatDate, getInterestBadgeStyle } from "@/lib/utils";
import Link from "next/link";

type Props = {
  companies: any[];
};

const SALES_STATUS_LABELS: Record<string, string> = {
  new: "진행 중",
  contracted: "계약 완료",
};

export default function CompanyTable({ companies }: Props) {
  return (
    <Card className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
      <CardContent className="p-0">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr className="border-b">
              <th className="px-5 py-4 text-left">업체명</th>
              <th className="px-5 py-4 text-left">대표자</th>
              <th className="px-5 py-4 text-left">대표 연락처</th>
              <th className="px-5 py-4 text-left">지역</th>
              <th className="px-5 py-4 text-left">관심도</th>
              <th className="px-5 py-4 text-left">영업 상태</th>
              <th className="px-5 py-4 text-left">다음 연락일</th>
              <th className="px-5 py-4 text-left">등록일</th>
              <th className="px-5 py-4 text-center">관리</th>
            </tr>
          </thead>

          <tbody>
            {companies.map((company) => {
              const nextSchedule = company.contact_schedules?.find(
                (schedule: any) => !schedule.completed,
              );

              return (
                <tr key={company.id} className="border-b last:border-b-0">
                  <td className="px-5 py-4 font-semibold">{company.name}</td>
                  <td className="px-5 py-4">{company.ceo_name ?? "-"}</td>
                  <td className="px-5 py-4">{company.ceo_phone ?? "-"}</td>
                  <td className="px-5 py-4">{company.region ?? "-"}</td>

                  <td className="px-5 py-4">
                    <Badge className={getInterestBadgeStyle(company.interest_level)}>
                      {
                        INTEREST_LEVEL_LABELS[
                          company.interest_level as keyof typeof INTEREST_LEVEL_LABELS
                        ]
                      }
                    </Badge>
                  </td>

                  <td className="px-5 py-4">
                    <Badge variant="secondary">
                      {SALES_STATUS_LABELS[company.sales_status] ?? company.sales_status}
                    </Badge>
                  </td>

                  <td className="px-5 py-4">
                    {nextSchedule ? formatDate(nextSchedule.scheduled_at) : "-"}
                  </td>

                  <td className="px-5 py-4">{formatDate(company.created_at)}</td>

                  <td className="px-5 py-4 text-center">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/companies/${company.id}`}>상세 보기</Link>
                    </Button>
                  </td>
                </tr>
              );
            })}

            {companies.length === 0 && (
              <tr>
                <td colSpan={9} className="py-16 text-center text-gray-500">
                  담당 중인 업체가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
