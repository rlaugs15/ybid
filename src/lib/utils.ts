import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 캐시키 배열을 문자열로 변환
export const cacheCore = {
  fromKey: (key: readonly (string | number)[]) => key.join(":"),
};

/* 쿼리키에서 undefined나 null 제거하는 함수 */
export function safeKey(...args: (string | number | undefined | null)[]) {
  return args
    .filter((v): v is string | number => v !== undefined && v !== null)
    .map((v) => String(v));
}
