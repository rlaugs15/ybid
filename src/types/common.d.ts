import { BUSINESS_GROUP_LABELS } from "@/constants/businessData";

export type ApiResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      message: string;
    };

export type InterestLevel = "high" | "medium" | "low";

export type BusinessGroup = keyof typeof BUSINESS_GROUP_LABELS;
