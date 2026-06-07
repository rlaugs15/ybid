import { z } from "zod";

export const createCompanySchema = z
  .object({
    // 업체 정보
    name: z.string().min(1, "업체명을 입력해주세요."),

    ceoName: z.string().optional(),

    ceoPhone: z
      .string()
      .transform((value) => value.replace(/[^0-9]/g, ""))
      .optional(),

    region: z.string().min(1, "지역을 선택해주세요."),

    // 공사업 정보
    businessGroup: z.string().min(1, "공사업 유형을 선택해주세요."),

    businessType: z.string().min(1, "대업종을 선택해주세요."),

    specialtyType: z.string().optional(),

    // 담당자 정보
    managerName: z.string().optional(),

    managerPhone: z
      .string()
      .transform((value) => value.replace(/[^0-9]/g, ""))
      .optional(),

    managerEmail: z.email("올바른 이메일 형식이 아닙니다.").optional().or(z.literal("")),

    managerPosition: z.string().optional(),

    // 영업 정보
    interestLevel: z.enum(["high", "medium", "low"]),

    salesStatus: z
      .enum(["new", "in_progress", "reviewing", "hold", "contracted", "failed"])
      .optional(),

    nextContactDate: z.string().optional(),

    memo: z.string().optional(),
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

export type CreateCompanyFormValues = z.infer<typeof createCompanySchema>;
