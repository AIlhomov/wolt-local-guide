import { Search, Sparkles, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useState } from "react";

const suggestions = [
  { text: "Sushi - You usually order this on Thursdays", confidence: 95 },
  { text: "Pizza - Perfect for your movie night", confidence: 88 },
  { text: "Healthy Bowl - Based on your lunch patterns", confidence: 82 },
];

export const PredictiveSearch = () => {
  const [focused, setFocused] = useState(false);
  
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="What are you craving?"
          className="pl-12 pr-12 h-14 text-base border-2 border-border focus:border-primary transition-colors bg-background"
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
        />
        <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary animate-pulse" />
      </div>
      
      {focused && (
        <Card className="absolute top-full mt-2 w-full p-4 border-2 border-border shadow-[var(--shadow-large)] bg-card animate-fade-in z-50">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-card-foreground">AI Predictions</span>
            </div>
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-card-foreground group-hover:text-primary transition-colors">
                    {suggestion.text}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {suggestion.confidence}% match
                  </span>
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
