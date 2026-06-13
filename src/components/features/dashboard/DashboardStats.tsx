import { DashboardResponse } from "@/types/dashboard";
import { BadgeAlert, BriefcaseBusiness, User, UserRound, Users } from "lucide-react";
import DashboardStatCard from "./DashboardStatCard";

type Props = {
  dashboard?: DashboardResponse;
};

export default function DashboardStats({ dashboard }: Props) {
  const stats = [
    {
      title: "내 업체 수",
      count: dashboard?.myCompanyCount ?? 0,
      icon: Users,
      color: "text-blue-400",
    },
    {
      title: "오늘 연락",
      count: dashboard?.todayContactCount ?? 0,
      icon: User,
      color: "text-violet-400",
    },
    {
      title: "지난 연락",
      count: dashboard?.overdueContactCount ?? 0,
      icon: UserRound,
      color: "text-sky-400",
    },
    {
      title: "이번 달 계약",
      count: dashboard?.contractedThisMonthCount ?? 0,
      icon: BriefcaseBusiness,
      color: "text-emerald-400",
    },
    {
      title: "관심도 상",
      count: dashboard?.highInterestCount ?? 0,
      icon: BadgeAlert,
      color: "text-orange-400",
    },
  ];

  return (
    <section className="grid grid-cols-5 gap-4">
      {stats.map((item) => (
        <DashboardStatCard
          key={item.title}
          title={item.title}
          count={item.count}
          icon={item.icon}
          color={item.color}
        />
      ))}
    </section>
  );
}
