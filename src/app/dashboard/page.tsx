import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInterestBadgeStyle } from "@/lib/utils";
import { BadgeAlert, BriefcaseBusiness, User, UserRound, Users } from "lucide-react";

const stats = [
  {
    title: "내 업체 수",
    count: 32,
    icon: Users,
    color: "text-blue-400",
  },
  {
    title: "오늘 연락",
    count: 5,
    icon: User,
    color: "text-violet-400",
  },
  {
    title: "견적 진행",
    count: 2,
    icon: UserRound,
    color: "text-sky-400",
  },
  {
    title: "이번 달 계약",
    count: 3,
    icon: BriefcaseBusiness,
    color: "text-emerald-400",
  },
  {
    title: "관심도 상",
    count: 8,
    icon: BadgeAlert,
    color: "text-orange-400",
  },
];

const todayContacts = [
  {
    id: 1,
    companyName: "한빛건설",
    managerName: "김영수",
    phone: "010-1234-5678",
    nextContactDate: "2026.06.03",
    priority: "high",
  },
  {
    id: 2,
    companyName: "대성전기",
    managerName: "박철수",
    phone: "010-1111-1111",
    nextContactDate: "2026.06.03",
    priority: "medium",
  },
  {
    id: 3,
    companyName: "미래유통",
    managerName: "이민호",
    phone: "010-2222-2222",
    nextContactDate: "2026.06.03",
    priority: "low",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-display font-bold">대시보드</h2>
        <p className="font-semibold text-gray-600">오늘 해야 할 영업 업무를 확인합니다.</p>
      </section>

      <section className="mt-6 grid grid-cols-5 gap-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.title}>
              <CardHeader className="pb-2">
                <CardTitle>
                  <h3 className="text-h3 font-medium text-gray-500">{item.title}</h3>
                </CardTitle>
              </CardHeader>

              <CardContent className="flex items-center justify-between my-4">
                <p className="text-3xl font-bold">{item.count}개</p>

                <Icon size={24} className={item.color} />
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="space-y-6">
        <h2 className="text-h2 font-bold">오늘 연락해야 할 업체</h2>

        <div className="space-y-4">
          {todayContacts.map((company) => (
            <Card key={company.id}>
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Badge className={getInterestBadgeStyle(company.priority)}>
                      {company.priority === "high"
                        ? "관심도 상"
                        : company.priority === "medium"
                          ? "관심도 중"
                          : "관심도 하"}
                    </Badge>

                    <h3 className="font-semibold text-lg">{company.companyName}</h3>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    담당자: {company.managerName} / {company.phone}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    다음 연락일: {company.nextContactDate}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline">상세보기</Button>

                  <Button variant="outline">연락 완료</Button>

                  <Button>일정 변경</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
