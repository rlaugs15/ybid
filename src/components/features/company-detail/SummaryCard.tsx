type SummaryCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

export default function SummaryCard({ icon, label, value }: SummaryCardProps) {
  return (
    <div
      className="
        flex items-center gap-5
        rounded-[28px]
        border
        border-slate-200
        bg-white
        p-6
        shadow-lg
      "
    >
      {icon}

      <div>
        <p className="text-sm text-slate-500">{label}</p>

        <p className="mt-1 text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
