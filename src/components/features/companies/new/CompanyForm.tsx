"use client";

import Loading from "@/components/common/Loading";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BUSINESS_GROUPS } from "@/constants/businessData";
import useCompany from "@/hooks/companies/useCompany";
import useCreateCompany from "@/hooks/companies/useCreateCompany";
import useUpdateCompany from "@/hooks/companies/useUpdateCompany";
import { toCompanyFormValues } from "@/lib/utils";
import { CreateCompanyFormValues, createCompanySchema } from "@/schemas/companySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

export type CompanyFormMode = "create" | "edit";

type CompanyFormProps = {
  mode?: CompanyFormMode;
};

const EMPTY_VALUES: CreateCompanyFormValues = {
  name: "",
  ceoName: "",
  ceoPhone: "",
  region: "",
  managerName: "",
  managerPhone: "",
  interestLevel: "medium",
  salesStatus: "new",
  scheduledAt: "",
  memo: "",
  businessLicenses: [
    {
      businessGroup: "",
      businessType: "",
      specialtyType: "",
      isPrimary: true,
    },
  ],
};

export default function CompanyForm({ mode = "create" }: CompanyFormProps) {
  const router = useRouter();
  const params = useParams();

  const companyId = mode === "edit" ? String(params.companyId) : "";

  const { data: company, isPending: companyPending } = useCompany(companyId);

  const form = useForm<CreateCompanyFormValues>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (!company) return;
    form.reset(toCompanyFormValues(company));
  }, [company, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "businessLicenses",
  });

  const { mutate: createCompanyMutation, isPending: isCreating } = useCreateCompany();
  const { mutate: updateCompanyMutation, isPending: isUpdating } = useUpdateCompany();

  if (mode === "edit" && companyPending) {
    return <Loading />;
  }

  const isPending = isCreating || isUpdating;

  const onSubmit = (values: CreateCompanyFormValues) => {
    const input = {
      name: values.name,
      ceoName: values.ceoName,
      ceoPhone: values.ceoPhone,
      region: values.region,
      managerName: values.managerName,
      managerPhone: values.managerPhone,
      interestLevel: values.interestLevel,
      salesStatus: values.salesStatus,
      memo: values.memo,
      businessLicenses: values.businessLicenses,
      contactSchedule: values.scheduledAt
        ? {
            scheduledAt: values.scheduledAt,
          }
        : null,
    };

    if (mode === "edit") {
      if (!companyId) return;

      updateCompanyMutation(
        {
          companyId: String(companyId),
          input,
        },
        {
          onSuccess: () => {
            router.push(`/companies/${companyId}`);
          },
        },
      );

      return;
    }

    createCompanyMutation(input, {
      onSuccess: ({ id }) => {
        router.push(`/companies/${id}`);
      },
    });
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="rounded-2xl border bg-card p-8 shadow-sm space-y-10">
        {/* 기본 정보 */}
        <div className="grid gap-6 md:grid-cols-2">
          <Field>
            <FieldLabel>
              업체명 <span className="text-red-500">*</span>
            </FieldLabel>
            <Input {...form.register("name")} />
            <FieldError errors={[form.formState.errors.name]} />
          </Field>

          <Field>
            <FieldLabel>
              지역 <span className="text-red-500">*</span>
            </FieldLabel>
            <Input {...form.register("region")} />
            <FieldError errors={[form.formState.errors.region]} />
          </Field>

          <Field>
            <FieldLabel>대표자명</FieldLabel>
            <Input {...form.register("ceoName")} />
          </Field>

          <Field>
            <FieldLabel>대표 연락처</FieldLabel>
            <Input {...form.register("ceoPhone")} />
          </Field>
        </div>

        {/* 담당자 정보 */}
        <div className="grid gap-6 md:grid-cols-2">
          <Field>
            <FieldLabel>담당자명</FieldLabel>
            <Input {...form.register("managerName")} />
          </Field>

          <Field>
            <FieldLabel>담당자 연락처</FieldLabel>
            <Input {...form.register("managerPhone")} />
          </Field>
        </div>

        {/* 공사업 정보 */}
        {/* 공사업 정보 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">보유 공사업 정보</h3>

              <p className="text-sm text-muted-foreground">
                해당 업체가 보유한 모든 공사업 정보를 추가해주세요.
              </p>
            </div>

            <Button
              type="button"
              onClick={() =>
                append({
                  businessGroup: "",
                  businessType: "",
                  specialtyType: "",
                  isPrimary: false,
                })
              }
            >
              + 업종 추가
            </Button>
          </div>

          {fields.map((field, index) => {
            const businessGroup = form.watch(`businessLicenses.${index}.businessGroup`);

            const selectedGroup = BUSINESS_GROUPS[businessGroup as keyof typeof BUSINESS_GROUPS];

            const businessTypes = selectedGroup?.categories ?? [];

            const selectedBusinessType = form.watch(`businessLicenses.${index}.businessType`);

            const specialtyOptions =
              businessGroup === "professional"
                ? (selectedGroup?.categories.find(
                    (
                      category,
                    ): category is {
                      label: string;
                      specialties: string[];
                    } => typeof category !== "string" && category.label === selectedBusinessType,
                  )?.specialties ?? [])
                : [];

            return (
              <div key={field.id} className="rounded-xl border p-4 space-y-4">
                <div className="flex items-center justify-between">
                  {index === 0 && (
                    <span className="rounded bg-blue-500 px-2 py-1 text-xs text-white">
                      대표 업종
                    </span>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                  {/* 공사업 유형 */}
                  <Field>
                    <FieldLabel>
                      공사업 유형 <span className="text-red-500">*</span>
                    </FieldLabel>

                    <Controller
                      control={form.control}
                      name={`businessLicenses.${index}.businessGroup`}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);

                            form.setValue(`businessLicenses.${index}.businessType`, "");

                            form.setValue(`businessLicenses.${index}.specialtyType`, "");
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="선택" />
                          </SelectTrigger>

                          <SelectContent>
                            <SelectItem value="professional">전문</SelectItem>

                            <SelectItem value="general">종합</SelectItem>

                            <SelectItem value="electrical">전소통</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FieldError
                      errors={[form.formState.errors.businessLicenses?.[index]?.businessGroup]}
                    />
                  </Field>

                  {/* 대업종 */}
                  <Field>
                    <FieldLabel>
                      대업종 <span className="text-red-500">*</span>
                    </FieldLabel>

                    <Controller
                      control={form.control}
                      name={`businessLicenses.${index}.businessType`}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);

                            form.setValue(`businessLicenses.${index}.specialtyType`, "");
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="선택" />
                          </SelectTrigger>

                          <SelectContent>
                            {businessTypes.map((item) => {
                              const label = typeof item === "string" ? item : item.label;

                              return (
                                <SelectItem key={label} value={label}>
                                  {label}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FieldError
                      errors={[form.formState.errors.businessLicenses?.[index]?.businessType]}
                    />
                  </Field>

                  {/* 주력분야 */}
                  <Field>
                    <FieldLabel>주력분야</FieldLabel>

                    <Controller
                      control={form.control}
                      name={`businessLicenses.${index}.specialtyType`}
                      render={({ field }) => (
                        <Select
                          value={field.value ?? ""}
                          onValueChange={field.onChange}
                          disabled={businessGroup !== "professional"}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="선택" />
                          </SelectTrigger>

                          <SelectContent>
                            {specialtyOptions.map((item) => (
                              <SelectItem key={item} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FieldError
                      errors={[form.formState.errors.businessLicenses?.[index]?.specialtyType]}
                    />
                  </Field>

                  {/* 삭제 버튼 자리 */}
                  <div className="flex items-end">
                    {index > 0 && (
                      <Button type="button" variant="destructive" onClick={() => remove(index)}>
                        삭제
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <FieldError errors={[form.formState.errors.businessLicenses]} />
        </div>

        {/* 영업 정보 */}
        <div className="grid gap-6 md:grid-cols-3">
          <Field>
            <FieldLabel>
              관심도 <span className="text-red-500">*</span>
            </FieldLabel>

            <Controller
              control={form.control}
              name="interestLevel"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="high">상</SelectItem>
                    <SelectItem value="medium">중</SelectItem>
                    <SelectItem value="low">하</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          {/*  <Field>
            <FieldLabel>진행상태</FieldLabel>

            <Controller
              control={form.control}
              name="salesStatus"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="new">신규</SelectItem>
                    <SelectItem value="in_progress">진행중</SelectItem>
                    <SelectItem value="reviewing">검토중</SelectItem>
                    <SelectItem value="hold">보류</SelectItem>
                    <SelectItem value="contracted">계약완료</SelectItem>
                    <SelectItem value="failed">실패</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field> */}

          <Field>
            <FieldLabel>다음 연락일</FieldLabel>

            <Input
              type="date"
              min={format(new Date(), "yyyy-MM-dd")}
              {...form.register("scheduledAt")}
            />
          </Field>
        </div>

        <Field>
          <FieldLabel>메모</FieldLabel>

          <Textarea rows={5} {...form.register("memo")} />
        </Field>

        <div className="flex justify-end gap-4 border-t pt-8">
          <Button type="button" variant="outline" className="w-40" onClick={() => router.back()}>
            취소
          </Button>

          <Button type="submit" className="w-40" disabled={isPending}>
            {mode === "edit" ? "수정 저장" : "저장"}
          </Button>
        </div>
      </div>
    </form>
  );
}
