import { INTEREST_LEVEL_LABELS } from "@/constants/businessData";

type Props = {
  items: [string, string][];
};

export default function InfoGrid({ items }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <div className="grid auto-cols-fr grid-flow-col">
        {items.flatMap(([label, value]) => [
          <div
            key={`${label}-label`}
            className="
              border-r
              w-40
              bg-slate-50
              px-8
              py-6
              font-semibold
              text-slate-700
            "
          >
            {label}
          </div>,

          <div
            key={`${label}-value`}
            className="
              border-r
              px-8
              py-6
            "
          >
            {INTEREST_LEVEL_LABELS[value as keyof typeof INTEREST_LEVEL_LABELS] ?? value}
          </div>,
        ])}
      </div>
    </div>
  );
}
