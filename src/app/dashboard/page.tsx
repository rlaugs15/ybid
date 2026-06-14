"use client";

import PageHeader from "@/components/common/PageHeader";
import DashboardStats from "@/components/features/dashboard/DashboardStats";
import TodayContactsSection from "@/components/features/dashboard/TodayContactsSection";
import { useDashboard } from "@/hooks/dashboard/useDashboard";
import useUser from "@/hooks/user/useUser";

export default function DashboardPage() {
  const { data: user } = useUser();
  const { data: dashboard, isLoading: dashboardLoading } = useDashboard(String(user?.id));
  return (
    <div className="space-y-10">
      <PageHeader title="대시보드" description="오늘 해야 할 영업 업무를 확인합니다." />

      <DashboardStats dashboard={dashboard} />

      <TodayContactsSection
        contacts={dashboard?.todayContacts ?? []}
        isLoading={dashboardLoading}
      />
    </div>
  );
}
