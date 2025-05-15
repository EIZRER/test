import { Card, CardContent } from "@/components/ui/card";

type Props = {
  imageUrl: string;
  title: string;
};

export default function EventImage({ imageUrl, title }: Props) {
  return (
    <img
      src={imageUrl}
      alt={title}
      className="w-full h-[300px] object-cover"
    />
  );
}
