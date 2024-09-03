import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import clsx from "clsx";

interface InfoCardProps {
  title: string;
  content?: string;
  position?: "start" | "middle" | "last";
}

const InfoCard = ({ title, content, position }: InfoCardProps) => {
  return (
    <Card
      className={clsx(
        "w-full lg:mb-0 mb-4",
        position === "start" && "lg:rounded-l-xl lg:rounded-r-none",
        position === "last" && "lg:rounded-r-xl lg:rounded-l-none",
        position === "middle" && "rounded-none"
      )}
    >
      <CardHeader>
        <CardTitle className="text-center">
          <div className="text-lg">{title}</div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <div className="text-4xl font-bold">{content}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InfoCard;
