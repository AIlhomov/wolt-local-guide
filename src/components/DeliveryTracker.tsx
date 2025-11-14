import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Trophy, Flame, Clock, MapPin, Bike, ChefHat, Package, Zap, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AIBadge } from "./AIBadge";
import { DeliveryMap } from "./DeliveryMap";
import { DeliveryGame } from "./DeliveryGame";

interface DeliveryTrackerProps {
  open: boolean;
  onClose: () => void;
}

export const DeliveryTracker = ({ open, onClose }: DeliveryTrackerProps) => {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [aiPrediction, setAiPrediction] = useState("18 min");
  const [streak, setStreak] = useState(5);
  const [points, setPoints] = useState(340);
  const [newAchievement, setNewAchievement] = useState<string | null>(null);
  const [mapProgress, setMapProgress] = useState(0);
  
  const stages = [
    { icon: ChefHat, label: "Order Confirmed", time: "2 min ago", tip: "The kitchen is preparing your meal with fresh ingredients!" },
    { icon: Flame, label: "Cooking", time: "Now", tip: "AI predicts your food will be ready 2 minutes early!" },
    { icon: Package, label: "Ready for Pickup", time: "5 min", tip: "Your courier is nearby and will arrive soon!" },
    { icon: Bike, label: "On the Way", time: "12 min", tip: "AI optimized the route - saving 3 minutes!" },
    { icon: MapPin, label: "Delivered", time: "18 min", tip: "Enjoy your meal! 🎉" }
  ];

  const achievements = [
    { icon: Flame, label: "5-Day Streak", unlocked: true },
    { icon: Star, label: "Foodie Explorer", unlocked: true },
    { icon: Zap, label: "Speed Orderer", unlocked: false },
    { icon: Trophy, label: "VIP Member", unlocked: false },
  ];

  useEffect(() => {
    if (!open) return;
    
    // Sync progress with map progress
    const currentProgress = Math.max(progress, mapProgress);
    
    if (currentProgress > progress) {
      setProgress(currentProgress);
    }
    
    // Update stage based on progress
    if (currentProgress > 80 && currentStage < 4) setCurrentStage(4);
    else if (currentProgress > 60 && currentStage < 3) setCurrentStage(3);
    else if (currentProgress > 40 && currentStage < 2) setCurrentStage(2);
    else if (currentProgress > 20 && currentStage < 1) setCurrentStage(1);
    
    // Update AI prediction
    const remaining = Math.ceil((100 - currentProgress) * 0.18);
    setAiPrediction(`${remaining} min`);
    
    // Award milestone points
    if ((currentProgress === 25 || currentProgress === 50 || currentProgress === 75) && points < 400) {
      setPoints(p => p + 10);
    }
    
    if (currentProgress >= 100) {
      setNewAchievement("Order Complete! +50 points");
      setPoints(p => p + 50);
    }
  }, [open, currentStage, mapProgress, progress, points]);

  const handleGameScore = (gameScore: number) => {
    setPoints(340 + gameScore);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Live Order Tracking
            <AIBadge className="ml-2">AI-Powered</AIBadge>
          </DialogTitle>
        </DialogHeader>

        {/* Gamification Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4 text-center border-0 bg-gradient-to-br from-primary/10 to-secondary/10">
            <Flame className="h-6 w-6 text-primary mx-auto mb-1" />
            <div className="text-2xl font-bold text-foreground">{streak}</div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </Card>
          <Card className="p-4 text-center border-0 bg-gradient-to-br from-secondary/10 to-accent/10">
            <Star className="h-6 w-6 text-secondary mx-auto mb-1" />
            <div className="text-2xl font-bold text-foreground">{points}</div>
            <div className="text-xs text-muted-foreground">Points</div>
          </Card>
          <Card className="p-4 text-center border-0 bg-gradient-to-br from-accent/10 to-primary/10">
            <Clock className="h-6 w-6 text-accent mx-auto mb-1" />
            <div className="text-2xl font-bold text-foreground">{aiPrediction}</div>
            <div className="text-xs text-muted-foreground">AI Estimate</div>
          </Card>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">Delivery Progress</span>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Map and Game Tabs */}
        <Tabs defaultValue="map" className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="map">🗺️ Live Map</TabsTrigger>
            <TabsTrigger value="game">🎮 Mini Game</TabsTrigger>
          </TabsList>
          <TabsContent value="map" className="mt-4">
            <DeliveryMap onProgressUpdate={setMapProgress} />
            <p className="text-xs text-muted-foreground text-center mt-2">
              Watch your delivery driver in real-time
            </p>
          </TabsContent>
          <TabsContent value="game" className="mt-4">
            <DeliveryGame onScoreUpdate={handleGameScore} />
            <p className="text-xs text-muted-foreground text-center mt-2">
              Earn extra points while you wait!
            </p>
          </TabsContent>
        </Tabs>

        {/* Delivery Stages */}
        <div className="space-y-4 mb-6">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = idx === currentStage;
            const isComplete = idx < currentStage;
            
            return (
              <Card 
                key={idx}
                className={`p-4 transition-all duration-500 border-0 ${
                  isActive 
                    ? 'bg-gradient-to-r from-primary/20 to-secondary/20 shadow-[var(--shadow-medium)] scale-105' 
                    : isComplete
                    ? 'bg-success/10'
                    : 'bg-muted/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full ${
                    isActive ? 'bg-primary animate-pulse' :
                    isComplete ? 'bg-success' : 'bg-muted'
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      isActive || isComplete ? 'text-primary-foreground' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground">{stage.label}</span>
                      {isActive && (
                        <Badge className="bg-primary text-primary-foreground">
                          <Zap className="h-3 w-3 mr-1" />
                          Live
                        </Badge>
                      )}
                      {isComplete && (
                        <Badge className="bg-success text-success-foreground">✓</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{stage.time}</p>
                    {isActive && (
                      <p className="text-sm text-foreground bg-background/50 p-2 rounded">
                        💡 {stage.tip}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* AI Insights */}
        <Card className="p-4 border-0 bg-gradient-to-r from-primary/10 to-secondary/10 mb-6">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary mt-1" />
            <div>
              <h4 className="font-semibold text-foreground mb-1">AI Delivery Insights</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Your courier is {["Alex", "Maria", "John"][Math.floor(Math.random() * 3)]} - 4.9★ rating, 2,341 deliveries</li>
                <li>• Route optimized to avoid traffic on Main Street</li>
                <li>• 92% chance of arriving 2 minutes early</li>
                <li>• Perfect weather conditions for delivery</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Achievements */}
        <div>
          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Achievements
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement, idx) => {
              const Icon = achievement.icon;
              return (
                <Card 
                  key={idx}
                  className={`p-3 border-0 transition-all ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-br from-primary/20 to-secondary/20' 
                      : 'bg-muted/20 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${
                      achievement.unlocked ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                    <span className="text-sm font-medium text-foreground">{achievement.label}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Achievement Notification */}
        {newAchievement && (
          <Card className="p-4 border-2 border-primary bg-gradient-to-r from-primary/20 to-secondary/20 animate-scale-in mt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-full">
                <Trophy className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Achievement Unlocked!</p>
                <p className="text-sm text-muted-foreground">{newAchievement}</p>
              </div>
            </div>
          </Card>
        )}

        <Button onClick={onClose} className="w-full mt-4">
          Close Tracker
        </Button>
      </DialogContent>
    </Dialog>
  );
};
