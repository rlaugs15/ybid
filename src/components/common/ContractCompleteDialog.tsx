"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";

import useUpdateCompanyContract from "@/hooks/contract/useUpdateCompanyContract";
import { CompleteContractForm, completeContractSchema } from "@/schemas/completeContractSchema";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "../ui/field";

type Props = {
  companyId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ContractCompleteDialog({ companyId, open, onOpenChange }: Props) {
  const mutation = useUpdateCompanyContract();

  const form = useForm<CompleteContractForm>({
    resolver: zodResolver(completeContractSchema),

    defaultValues: {
      memo: "",
    },
  });

  const onSubmit = ({ memo }: CompleteContractForm) => {
    mutation.mutate(
      {
        companyId,
        action: "complete",
        memo: memo,
      },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          form.reset();
        }

        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>계약 완료</DialogTitle>

          <DialogDescription>
            계약 완료 처리하면 업체 상태가 오늘날짜로 계약 완료 처리됩니다.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            name="memo"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>계약 메모</FieldLabel>

                <FieldContent>
                  <Textarea
                    {...field}
                    id={field.name}
                    rows={5}
                    aria-invalid={fieldState.invalid}
                    placeholder="계약 관련 메모를 입력하세요."
                  />

                  <FieldDescription>계약 조건이나 특이사항을 기록할 수 있습니다.</FieldDescription>

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FieldContent>
              </Field>
            )}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>

            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "처리 중..." : "계약 완료"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
