import { z } from "zod";

export const businessLicenseSchema = z
  .object({
    businessGroup: z.string().min(1, "공사업 유형을 선택해주세요."),

    businessType: z.string().min(1, "대업종을 선택해주세요."),

    specialtyType: z.string().optional(),

    isPrimary: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.businessGroup === "professional" && !data.specialtyType) {
      ctx.addIssue({
        code: "custom",
        path: ["specialtyType"],
        message: "주력분야를 선택해주세요.",
      });
    }
  });

export const createCompanySchema = z.object({
  // 기본 정보
  name: z.string().min(1, "업체명을 입력해주세요."),

  ceoName: z.string().optional(),

  ceoPhone: z
    .string()
    .transform((value) => value.replace(/[^0-9]/g, ""))
    .optional(),

  region: z.string().min(1, "지역을 선택해주세요."),

  // 담당자 정보
  managerName: z.string().optional(),

  managerPhone: z
    .string()
    .transform((value) => value.replace(/[^0-9]/g, ""))
    .optional(),

  // 영업 정보
  interestLevel: z.enum(["high", "medium", "low"]),

  salesStatus: z.enum(["new", "in_progress", "reviewing", "hold", "contracted", "failed"]),

  nextContactDate: z.string(),

  memo: z.string().optional(),

  // 공사업 정보
  businessLicenses: z
    .array(businessLicenseSchema)
    .min(1, "최소 1개 이상의 업종을 등록해야 합니다."),
});

export type CreateCompanyFormValues = z.infer<typeof createCompanySchema>;
