import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, getInterestBadgeStyle } from "@/lib/utils";
import { DashboardTodayContact } from "@/types/dashboard";

type Props = {
  contact: DashboardTodayContact;
};

export default function TodayContactCard({ contact }: Props) {
  const company = contact.companies;

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge className={getInterestBadgeStyle(company.interest_level)}>
              {company.interest_level === "high"
                ? "관심도 상"
                : company.interest_level === "medium"
                  ? "관심도 중"
                  : "관심도 하"}
            </Badge>

            <h3 className="text-lg font-semibold">{company.name}</h3>
          </div>

          <p className="text-sm text-muted-foreground">
            담당자: {company.manager_name ?? "-"} / {company.manager_phone ?? "-"}
          </p>

          <p className="text-sm text-muted-foreground">
            다음 연락일: {formatDate(contact.scheduled_at)}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">상세보기</Button>

          <Button variant="outline">연락 완료</Button>

          <Button>일정 변경</Button>
        </div>
      </CardContent>
    </Card>
  );
}
