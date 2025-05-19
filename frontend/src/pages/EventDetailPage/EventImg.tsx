import { Card, CardContent } from "@/components/ui/card";
import { getImageUrl } from "../../services/api";

type Props = {
  imageUrl: string;
  title: string;
};

export default function EventImage({ imageUrl, title }: Props) {
  return (
    <img
      src={getImageUrl(imageUrl)}
      alt={title}
      className="w-full h-[300px] object-cover"
    />
  );
}
