import { User } from "lucide-react";

type Props = {
  category: string;
  organizer: string;
};

export default function EventMeta({ category, organizer }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          {category}
        </span>
      </div>
      <div className="flex items-center gap-2 text-gray-500">
        <User className="h-4 w-4" />
        <span className="text-sm">{organizer}</span>
      </div>
    </div>
  );
}
