import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

type Props = {
  title: string;
  description: string;
  date: string;
  time: string;
};

export default function EventInfo({ title, description, date, time }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-500 mt-1">{date} @ {time}</p>
      </div>
      <div className="h-px bg-gray-200" />
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
