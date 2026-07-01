"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import ContractCancelDialog from "../ContractCancelDialog";
import ContractCompleteDialog from "../ContractCompleteDialog";

type Props = {
  companyId: string;
  salesStatus: string;
  className?: string;
};

export default function ContractButton({ companyId, salesStatus, className }: Props) {
  const [open, setOpen] = useState(false);

  const isContracted = salesStatus === "contracted";

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className={cn(
          isContracted
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-green-600 hover:bg-green-700 text-white",
          className,
        )}
      >
        {isContracted ? "계약 취소" : "계약 완료"}
      </Button>

      {isContracted ? (
        <ContractCancelDialog companyId={companyId} open={open} onOpenChange={setOpen} />
      ) : (
        <ContractCompleteDialog companyId={companyId} open={open} onOpenChange={setOpen} />
      )}
    </>
  );
}
