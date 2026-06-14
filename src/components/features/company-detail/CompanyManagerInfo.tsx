import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import InfoGrid from "./InfoGrid";

interface Props {
  manager_name: string;
  manager_phone: string;
}

export default function CompanyManagerInfo({ manager_name, manager_phone }: Props) {
  return (
    <Card>
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-2xl font-bold">
          <User className="h-6 w-6 text-blue-600" />
          담당자 정보
        </CardTitle>
      </CardHeader>

      <CardContent>
        <InfoGrid
          items={[
            ["담당자명", manager_name ?? "-"],
            ["담당자 연락처", manager_phone ?? "-"],
          ]}
        />
      </CardContent>
    </Card>
  );
}
