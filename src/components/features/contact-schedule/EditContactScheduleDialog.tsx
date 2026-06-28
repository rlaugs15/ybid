"use client";

import { Building2, CalendarIcon } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import useUpdateContactSchedule from "@/hooks/contact-schedule/useUpdateContactSchedule";
import { getInterestBadgeStyle } from "@/lib/utils";
import { DashboardTodayContact } from "@/types/dashboard";
import { format } from "date-fns";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: DashboardTodayContact;
};

export default function EditContactScheduleDialog({ open, onOpenChange, contact }: Props) {
  const { mutate: updateMutation, isPending } = useUpdateContactSchedule();

  const company = contact.companies;

  const [scheduledAt, setScheduledAt] = useState(contact.scheduled_at.slice(0, 10));
  const [memo, setMemo] = useState("");

  const handleUpdate = () => {
    updateMutation(
      {
        scheduleId: contact.id,
        input: {
          scheduledAt,
          memo: memo || undefined,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  const today = format(new Date(), "yyyy-MM-dd");

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value < today) {
      return;
    }

    setScheduledAt(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl rounded-3xl shadow-2xl border-none p-0">
        <DialogHeader className="border-b px-8 py-6">
          <DialogTitle className="text-3xl font-bold">연락 일정 변경</DialogTitle>

          <DialogDescription className="mt-2">
            해당 업체의 연락 예정 일정을 변경합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 px-8 py-8">
          {/* 업체 정보 */}
          <div className="flex items-center gap-6 rounded-2xl border p-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>

            <div className="flex-1">
              <div className="mb-2 flex items-center gap-3">
                <h3 className="text-xl font-bold">{company.name}</h3>

                <Badge className={getInterestBadgeStyle(company.interest_level)}>
                  {company.interest_level === "high"
                    ? "관심도 상"
                    : company.interest_level === "medium"
                      ? "관심도 중"
                      : "관심도 하"}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">
                담당자 : {company.manager_name ?? "-"}
              </p>

              <p className="text-sm text-muted-foreground">
                연락처 : {company.manager_phone ?? "-"}
              </p>
            </div>
          </div>

          {/* 연락 예정일 */}
          <div className="flex gap-8">
            <label className="w-28 pt-3 text-sm font-semibold">연락 예정일</label>

            <div className="flex-1">
              <div className="relative">
                <CalendarIcon className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                <Input
                  type="date"
                  min={today}
                  value={scheduledAt}
                  onChange={handleDateChange}
                  className="h-14 rounded-xl pl-12 text-base"
                />
              </div>

              <p className="mt-2 text-sm text-muted-foreground">달력에서 날짜를 선택해주세요.</p>
            </div>
          </div>

          {/* 메모: 추후 상세페이지에 어떻게 보여질지 고려할 것 */}
          {/* <div className="flex gap-8">
            <label className="w-28 pt-3 text-sm font-semibold">메모</label>

            <div className="flex-1">
              <Textarea
                placeholder="연락 일정 또는 내용을 메모해 주세요."
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="min-h-40 rounded-xl"
              />

              <div className="mt-2 flex justify-end text-sm text-muted-foreground">
                {memo.length}/500
              </div>
            </div>
          </div> */}

          {/* <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <div className="mb-2 flex items-center gap-2 font-semibold text-blue-700">
              <Info className="h-5 w-5" />
              변경 후 연락 일정 안내
            </div>

            <ul className="space-y-1 text-sm text-slate-600">
              <li>일정 변경 시 해당 날짜의 연락 예정에 반영됩니다.</li>

              <li>변경된 일정은 대시보드와 연락 예정 페이지에 즉시 적용됩니다.</li>
            </ul>
          </div> */}

          {/* 버튼 */}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="lg" onClick={() => onOpenChange(false)}>
              취소
            </Button>

            <Button size="lg" onClick={handleUpdate} disabled={isPending}>
              저장
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
