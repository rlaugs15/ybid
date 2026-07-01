"use client";

import useUpdateCompanyContract from "@/hooks/contract/useUpdateCompanyContract";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

type Props = {
  companyId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ContractCancelDialog({ companyId, open, onOpenChange }: Props) {
  const mutation = useUpdateCompanyContract();

  const handleCancel = () => {
    mutation.mutate(
      {
        companyId,
        action: "cancel",
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>계약을 취소하시겠습니까?</AlertDialogTitle>

          <AlertDialogDescription>
            계약 정보가 초기화되고 업체 상태가 진행 중으로 변경됩니다.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>닫기</AlertDialogCancel>

          <AlertDialogAction onClick={handleCancel} disabled={mutation.isPending}>
            계약 취소
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
