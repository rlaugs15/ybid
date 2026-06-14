import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { CompanyDetail } from "@/types/company-detail";
import { FileText } from "lucide-react";

interface Props {
  company: CompanyDetail;
}

export default function CompanyBasicInfo({ company }: Props) {
  return (
    <Card>
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-2xl font-bold">
          <FileText className="h-6 w-6 text-blue-600" />
          기본 정보
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-hidden rounded-3xl border border-slate-200">
          <table className="w-full table-fixed">
            <tbody>
              <tr className="border-b">
                <th className="w-36 bg-slate-50 px-8 py-6 text-left font-semibold">대표자</th>
                <td className="px-8 py-6">{company.ceo_name ?? "-"}</td>

                <th className="w-36 bg-slate-50 px-8 py-6 text-left font-semibold">등록일</th>
                <td className="px-8 py-6">{formatDate(company.created_at)}</td>
              </tr>

              <tr className="border-b">
                <th className="bg-slate-50 px-8 py-6 text-left font-semibold">대표 연락처</th>
                <td className="px-8 py-6">{company.ceo_phone ?? "-"}</td>

                <th rowSpan={2} className="align-top bg-slate-50 px-8 py-6 text-left font-semibold">
                  메모
                </th>

                <td rowSpan={2} className="align-top px-8 py-6 whitespace-pre-wrap">
                  {company.memo || "-"}
                </td>
              </tr>

              <tr>
                <th className="bg-slate-50 px-8 py-6 text-left font-semibold">지역</th>

                <td className="px-8 py-6">{company.region ?? "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
