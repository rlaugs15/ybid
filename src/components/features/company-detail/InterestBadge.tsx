import { getInterestBadgeStyle } from "@/lib/utils";
import { InterestLevel } from "@/types/common";

export default function InterestBadge({ level }: { level: InterestLevel }) {
  const map = {
    high: "상",
    medium: "중",
    low: "하",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-sm font-medium ${getInterestBadgeStyle(level)}`}>
      {map[level]}
    </span>
  );
}
