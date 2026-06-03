"use client";

import {
  BadgeCheck,
  Building2,
  Clock3,
  FileText,
  LayoutDashboard,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const salesMenus = [
  {
    title: "대시보드",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "내 업체 관리",
    url: "/companies",
    icon: Building2,
  },
  {
    title: "견적 현황 신청",
    url: "/quotes",
    icon: FileText,
  },
  {
    title: "연락 예정",
    url: "/contacts",
    icon: Clock3,
  },
  {
    title: "계약 완료 현황",
    url: "/contracts",
    icon: BadgeCheck,
  },
];

const adminMenus = [
  {
    title: "팀원별 현황",
    url: "/team-status",
    icon: Users,
  },
  {
    title: "1등 직원 관리",
    url: "/top-employee",
    icon: Trophy,
  },
];

export default function AppSidebar() {
  return (
    <Sidebar variant="sidebar" collapsible="icon" className="font-semibold bg-white">
      <SidebarHeader className="flex flex-row justify-between items-center">
        <div className="group-data-[state=collapsed]:hidden" />

        <div className="py-2 group-data-[state=collapsed]:hidden">
          <h2 className="text-3xl font-bold text-indigo-800">YBID</h2>
        </div>

        <div className="flex justify-center w-full group-data-[state=expanded]:w-auto">
          <SidebarTrigger />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* 영업 메뉴 */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-4">
              {salesMenus.map((menu) => (
                <SidebarMenuItem key={menu.title}>
                  <SidebarMenuButton asChild tooltip={menu.title}>
                    <Link href={menu.url}>
                      <menu.icon className="size-4" />
                      <span className="text-lg">{menu.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* 관리자 메뉴 */}
        <SidebarGroup>
          <div className="px-3 py-2 text-lg font-semibold text-muted-foreground group-data-[state=collapsed]:hidden">
            관리자 기능
          </div>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-4">
              {adminMenus.map((menu) => (
                <SidebarMenuItem key={menu.title}>
                  <SidebarMenuButton asChild tooltip={menu.title}>
                    <Link href={menu.url}>
                      <menu.icon className="size-4" />
                      <span className="text-lg">{menu.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-2 text-sm text-muted-foreground">김현준</div>
      </SidebarFooter>
    </Sidebar>
  );
}
