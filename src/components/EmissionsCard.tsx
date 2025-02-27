
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HTMLAttributes } from "react";

interface EmissionsCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  emissions: number;
  unit: string;
  distance?: number;
  disclaimer?: string;
  similarTo?: string[];
  className?: string;
}

const EmissionsCard = ({
  title,
  emissions,
  unit,
  distance,
  disclaimer,
  similarTo,
  className,
  ...props
}: EmissionsCardProps) => {
  return (
    <Card className={`overflow-hidden card-glass card-hover animate-fadeIn ${className}`} {...props}>
      <div className="bg-primary h-2 w-full"></div>
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-4">
          <Badge variant="secondary" className="self-start">
            Result
          </Badge>
          <h3 className="text-xl font-medium">{title}</h3>
          
          <div className="flex flex-col space-y-2">
            <div className="text-4xl font-semibold text-primary">
              {emissions.toLocaleString(undefined, { 
                minimumFractionDigits: 2,
                maximumFractionDigits: 2 
              })}
              <span className="text-lg font-normal text-gray-500 dark:text-gray-400 ml-1">
                {unit}
              </span>
            </div>
            
            {distance && (
              <p className="text-gray-500 dark:text-gray-400">
                Distance: {distance.toLocaleString()} km
              </p>
            )}
          </div>
          
          {similarTo && similarTo.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="font-medium">This is similar to:</h4>
              <ul className="space-y-2">
                {similarTo.map((item, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex">
                    <span className="mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {disclaimer && (
            <div className="mt-4 text-xs text-gray-400 dark:text-gray-500 border-t pt-4">
              {disclaimer}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmissionsCard;
