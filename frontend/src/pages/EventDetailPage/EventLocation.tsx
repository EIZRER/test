import { MapPin } from "lucide-react";

type Props = {
  address: string;
};

export default function EventLocation({ address }: Props) {
  return (
    <div className="flex items-center gap-2 text-gray-500">
      <MapPin className="h-4 w-4" />
      <span className="text-sm">{address}</span>
    </div>
  );
}
