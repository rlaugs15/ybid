import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BUSINESS_GROUP_LABELS } from "@/constants/businessData";
import { BusinessGroup } from "@/types/common";
import { Tables } from "@/types/database.types";
import { Building2 } from "lucide-react";

interface Props {
  business_licenses: Tables<"company_business_licenses">[];
}

export default function CompanyBusinessInfo({ business_licenses }: Props) {
  return (
    <Card>
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-2xl font-bold">
          <Building2 className="h-6 w-6 text-blue-600" />
          공사업 정보
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-center">
                <th className="px-4 py-3">구분</th>
                <th className="px-4 py-3">대업종</th>
                <th className="px-4 py-3">주력분야</th>
              </tr>
            </thead>

            <tbody className="text-center">
              {business_licenses.map((license) => (
                <tr key={license.id} className="border-t">
                  <td className="px-4 py-3">
                    {BUSINESS_GROUP_LABELS[license.business_group as BusinessGroup]}
                  </td>

                  <td className="px-4 py-3">{license.business_type}</td>

                  <td className="px-4 py-3">{license.specialty_type || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
