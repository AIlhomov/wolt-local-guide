import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIBadgeProps {
  className?: string;
  children?: React.ReactNode;
}

export const AIBadge = ({ className, children }: AIBadgeProps) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full",
        "bg-gradient-to-r from-primary to-secondary",
        "text-primary-foreground text-sm font-medium",
        "animate-pulse-glow",
        className
      )}
    >
      <Sparkles className="h-3.5 w-3.5" />
      {children || "AI Powered"}
    </div>
  );
};
