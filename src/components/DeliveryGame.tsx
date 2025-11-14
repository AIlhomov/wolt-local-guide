import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Trophy, Zap } from "lucide-react";

interface FoodItem {
  emoji: string;
  name: string;
}

const foodItems: FoodItem[] = [
  { emoji: "🍕", name: "Pizza" },
  { emoji: "🍔", name: "Burger" },
  { emoji: "🍣", name: "Sushi" },
  { emoji: "🍜", name: "Ramen" },
  { emoji: "🌮", name: "Taco" },
  { emoji: "🍰", name: "Cake" },
  { emoji: "🍱", name: "Bento" },
  { emoji: "🥗", name: "Salad" },
];

interface DeliveryGameProps {
  onScoreUpdate: (score: number) => void;
}

export const DeliveryGame = ({ onScoreUpdate }: DeliveryGameProps) => {
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentFood, setCurrentFood] = useState<FoodItem | null>(null);
  const [options, setOptions] = useState<FoodItem[]>([]);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const generateRound = () => {
    const correct = foodItems[Math.floor(Math.random() * foodItems.length)];
    const wrongOptions = foodItems
      .filter((item) => item.name !== correct.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const allOptions = [correct, ...wrongOptions].sort(() => Math.random() - 0.5);
    
    setCurrentFood(correct);
    setOptions(allOptions);
    setFeedback(null);
  };

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setTimeLeft(30);
    setStreak(0);
    generateRound();
  };

  const handleAnswer = (selected: FoodItem) => {
    if (!currentFood) return;

    if (selected.name === currentFood.name) {
      const points = 10 + (streak * 2);
      setScore((prev) => prev + points);
      setStreak((prev) => prev + 1);
      setFeedback("correct");
      onScoreUpdate(score + points);
      
      setTimeout(() => {
        generateRound();
      }, 500);
    } else {
      setStreak(0);
      setFeedback("wrong");
      
      setTimeout(() => {
        generateRound();
      }, 500);
    }
  };

  useEffect(() => {
    if (!gameActive) return;

    if (timeLeft <= 0) {
      setGameActive(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive, timeLeft]);

  if (!gameActive) {
    return (
      <Card className="p-6 border-0 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-bold text-foreground">Food Memory Game</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Match the emoji with the correct food name! Earn bonus points for streaks.
          </p>
          {score > 0 && (
            <div className="p-4 bg-background/50 rounded-lg">
              <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{score} points</p>
              <p className="text-xs text-muted-foreground">Great job!</p>
            </div>
          )}
          <Button onClick={startGame} className="w-full">
            {score > 0 ? "Play Again" : "Start Game"}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-0 bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary text-primary-foreground">
              Score: {score}
            </Badge>
            {streak > 0 && (
              <Badge className="bg-secondary text-secondary-foreground">
                <Zap className="h-3 w-3 mr-1" />
                {streak}x Streak
              </Badge>
            )}
          </div>
          <Badge variant="outline" className="text-foreground">
            ⏱️ {timeLeft}s
          </Badge>
        </div>

        {/* Question */}
        {currentFood && (
          <div className="text-center">
            <div 
              className={`text-8xl mb-4 transition-all duration-300 ${
                feedback === "correct" ? "animate-scale-in" : ""
              }`}
            >
              {currentFood.emoji}
            </div>
            <p className="text-sm text-muted-foreground mb-4">What food is this?</p>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div
            className={`text-center py-2 rounded-lg animate-scale-in ${
              feedback === "correct"
                ? "bg-success/20 text-success-foreground"
                : "bg-destructive/20 text-destructive-foreground"
            }`}
          >
            <p className="font-semibold">
              {feedback === "correct" ? "🎉 Correct!" : "❌ Try again!"}
            </p>
          </div>
        )}

        {/* Options */}
        <div className="grid grid-cols-2 gap-3">
          {options.map((option, index) => (
            <Button
              key={index}
              onClick={() => handleAnswer(option)}
              variant="outline"
              className="h-auto py-4 text-base hover:bg-primary/10 hover:border-primary transition-all"
              disabled={feedback !== null}
            >
              {option.name}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};
