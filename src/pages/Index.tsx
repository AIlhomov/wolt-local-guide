import { Sparkles, MapPin, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RestaurantCard } from "@/components/RestaurantCard";
import { TasteProfile } from "@/components/TasteProfile";
import { PredictiveSearch } from "@/components/PredictiveSearch";
import { AIBadge } from "@/components/AIBadge";
import heroImage from "@/assets/hero-food.jpg";
import sushiImage from "@/assets/sushi.jpg";
import pizzaImage from "@/assets/pizza.jpg";
import burgerImage from "@/assets/burger.jpg";
import pokeImage from "@/assets/poke.jpg";
import thaiImage from "@/assets/thai.jpg";
import dessertImage from "@/assets/dessert.jpg";

const Index = () => {
  const currentTime = new Date().getHours();
  const timeContext = currentTime < 12 ? "breakfast" : currentTime < 17 ? "lunch" : "dinner";
  
  const recommendations = [
    {
      name: "Sakura Sushi House",
      cuisine: "Japanese • Sushi",
      rating: 4.8,
      deliveryTime: "25-35 min",
      image: sushiImage,
      aiReason: "You love sushi on Thursdays, and this place matches your taste profile at 95%",
      matchScore: 95,
      trending: true,
    },
    {
      name: "Napoli Pizza Kitchen",
      cuisine: "Italian • Pizza",
      rating: 4.7,
      deliveryTime: "20-30 min",
      image: pizzaImage,
      aiReason: "Perfect comfort food for tonight's weather and your past Friday orders",
      matchScore: 92,
    },
    {
      name: "The Burger Lab",
      cuisine: "American • Burgers",
      rating: 4.6,
      deliveryTime: "15-25 min",
      image: burgerImage,
      aiReason: "Quick delivery and matches your preference for hearty meals",
      matchScore: 88,
    },
  ];

  const moreOptions = [
    {
      name: "Fresh Poke Co.",
      cuisine: "Hawaiian • Healthy",
      rating: 4.9,
      deliveryTime: "20-30 min",
      image: pokeImage,
    },
    {
      name: "Bangkok Street Kitchen",
      cuisine: "Thai • Asian",
      rating: 4.7,
      deliveryTime: "25-35 min",
      image: thaiImage,
    },
    {
      name: "Sweet Temptations",
      cuisine: "Desserts • Bakery",
      rating: 4.8,
      deliveryTime: "15-25 min",
      image: dessertImage,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl text-foreground">Wolt AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Helsinki</span>
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-background/80 to-background" />
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <AIBadge className="mb-4">
              AI Personal Food Concierge
            </AIBadge>
            
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground">
              We know what you'll
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> love</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powered by AI that learns your taste, predicts your cravings, and connects you with the perfect meal at the perfect time.
            </p>

            <div className="pt-4">
              <PredictiveSearch />
            </div>

            {/* Context Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 max-w-2xl mx-auto">
              <Card className="p-4 border-0 bg-card/50 backdrop-blur">
                <Clock className="h-5 w-5 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-card-foreground">Perfect for {timeContext}</p>
              </Card>
              <Card className="p-4 border-0 bg-card/50 backdrop-blur">
                <MapPin className="h-5 w-5 text-secondary mx-auto mb-2" />
                <p className="text-sm font-medium text-card-foreground">23°C, Sunny</p>
              </Card>
              <Card className="p-4 border-0 bg-card/50 backdrop-blur">
                <Users className="h-5 w-5 text-accent mx-auto mb-2" />
                <p className="text-sm font-medium text-card-foreground">2,345 orders now</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Recommendations */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Picked Just for You</h2>
              </div>
              <div className="grid gap-6">
                {recommendations.map((restaurant, idx) => (
                  <div key={idx} className="animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                    <RestaurantCard {...restaurant} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">More Options</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {moreOptions.map((restaurant, idx) => (
                  <div key={idx} className="animate-fade-in" style={{ animationDelay: `${(idx + 3) * 100}ms` }}>
                    <RestaurantCard {...restaurant} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Taste Profile */}
          <div className="lg:sticky lg:top-24 h-fit">
            <TasteProfile />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">How Wolt AI Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI analyzes your preferences, context, and patterns to make every order better than the last
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 text-center border-0 shadow-[var(--shadow-medium)] bg-card">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-primary-glow mx-auto mb-4 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-card-foreground">Smart Predictions</h3>
              <p className="text-sm text-muted-foreground">
                AI learns your taste profile and predicts what you'll love before you search
              </p>
            </Card>
            
            <Card className="p-6 text-center border-0 shadow-[var(--shadow-medium)] bg-card">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-secondary to-accent mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-6 w-6 text-secondary-foreground" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-card-foreground">Context Aware</h3>
              <p className="text-sm text-muted-foreground">
                Considers time, weather, location, and your schedule for perfect timing
              </p>
            </Card>
            
            <Card className="p-6 text-center border-0 shadow-[var(--shadow-medium)] bg-card">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-success to-accent mx-auto mb-4 flex items-center justify-center">
                <Users className="h-6 w-6 text-success-foreground" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-card-foreground">Continuously Learning</h3>
              <p className="text-sm text-muted-foreground">
                Gets better with every order, adapting to your evolving tastes
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="mb-2">Wolt AI Challenge Demo - Showcasing AI-Powered Local Commerce</p>
          <p className="text-xs">Built to demonstrate smart recommendations, predictive ordering, and personalized experiences</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
