import { Card, CardContent } from "@/components/ui/card";

export default function DashboardStatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <Card className="bg-[#1f1f1f] border border-gray-700 rounded-xl hover:border-[#00FFC2] shadow-sm hover:shadow-lg transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-400 flex items-center gap-2">
            {icon} {title}
          </span>
        </div>
        <div className="text-2xl font-bold text-white">
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
      </CardContent>
    </Card>
  );
}
