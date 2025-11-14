import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, Heart, TrendingUp } from "lucide-react";

const preferences = [
  { name: "Asian Cuisine", value: 92, color: "bg-primary" },
  { name: "Quick Meals", value: 85, color: "bg-secondary" },
  { name: "Healthy Options", value: 78, color: "bg-success" },
  { name: "Late Night Cravings", value: 70, color: "bg-accent" },
];

const insights = [
  "You prefer spicy food on weekdays",
  "Pizza orders spike on Friday evenings",
  "Health-conscious choices during lunch",
];

export const TasteProfile = () => {
  return (
    <Card className="p-6 border-0 shadow-[var(--shadow-medium)] bg-card">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold text-card-foreground">Your Taste Profile</h2>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-card-foreground mb-4 flex items-center gap-2">
            <Heart className="h-4 w-4 text-secondary" />
            Preference Strengths
          </h3>
          <div className="space-y-4">
            {preferences.map((pref) => (
              <div key={pref.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{pref.name}</span>
                  <span className="font-medium text-card-foreground">{pref.value}%</span>
                </div>
                <Progress value={pref.value} className="h-2" />
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-card-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-success" />
            AI Insights
          </h3>
          <ul className="space-y-2">
            {insights.map((insight, idx) => (
              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};
