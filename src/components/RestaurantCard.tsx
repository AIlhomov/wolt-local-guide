import { Clock, Star, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AIBadge } from "./AIBadge";

interface RestaurantCardProps {
  name: string;
  cuisine: string;
  price?: string;
  image?: string;
  rating?: number;
  deliveryTime?: string;
  aiReason?: string;
  matchScore?: number;
  trending?: boolean;
}

export const RestaurantCard = ({
  name,
  cuisine,
  price,
  image,
  rating,
  deliveryTime,
  aiReason,
  matchScore,
  trending,
}: RestaurantCardProps) => {
  return (
    <Card className="group overflow-hidden border-0 shadow-[var(--shadow-medium)] hover:shadow-[var(--shadow-large)] transition-all duration-300 hover:-translate-y-1 bg-card">
      <div className="relative h-48 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            No image
          </div>
        )}
        {matchScore && matchScore >= 90 && (
          <div className="absolute top-3 left-3">
            <AIBadge>
              {matchScore}% Match
            </AIBadge>
          </div>
        )}
        {trending && (
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="gap-1">
              <TrendingUp className="h-3 w-3" />
              Trending
            </Badge>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{name}</h3>
        <p className="text-sm text-muted-foreground mb-1">
          {cuisine} {price && `• ${price}`}
        </p>
        <div className="flex items-center gap-4 text-sm mb-1">
          {rating !== undefined && (
            <div className="flex items-center gap-1 text-accent-foreground">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="font-medium">{rating}</span>
            </div>
          )}
          {deliveryTime && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{deliveryTime}</span>
            </div>
          )}
        </div>
        {aiReason && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground italic">
              <span className="font-medium text-primary">AI suggests:</span> {aiReason}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
