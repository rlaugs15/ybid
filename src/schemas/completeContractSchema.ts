import { z } from "zod";

export const completeContractSchema = z.object({
  memo: z.string().max(500, "500자 이하로 입력해주세요.").optional(),
});

export type CompleteContractForm = z.infer<typeof completeContractSchema>;
