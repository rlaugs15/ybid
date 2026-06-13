import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  count: number;
  icon: LucideIcon;
  color: string;
};

export default function DashboardStatCard({ title, count, icon: Icon, color }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>
          <h3 className="text-h3 font-medium text-gray-500">{title}</h3>
        </CardTitle>
      </CardHeader>

      <CardContent className="my-4 flex items-center justify-between">
        <p className="text-3xl font-bold">{count}개</p>
        <Icon size={24} className={color} />
      </CardContent>
    </Card>
  );
}
