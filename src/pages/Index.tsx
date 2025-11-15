import { useState, useEffect } from "react";
import { ShoppingCart, LogOut, Utensils, Plus, Minus, Trash2, X, Package, Clock, MapPin, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { foodDatabase, FoodItem } from "@/lib/foodDatabase";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface IndexProps {
  onLogout?: () => void;
}

interface CartItem extends FoodItem {
  quantity: number;
}

type OrderStatus = 'idle' | 'preparing' | 'delivering' | 'delivered';

const Index = ({ onLogout }: IndexProps) => {
  const [restaurantFoods, setRestaurantFoods] = useState<FoodItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('idle');
  const [deliveryDistance] = useState(Math.floor(Math.random() * 15) + 5); // 5-20 km
  const [estimatedTime, setEstimatedTime] = useState(0);

  // Load restaurant foods on mount
  useEffect(() => {
    const foods = foodDatabase.getAllFoods();
    setRestaurantFoods(foods);
  }, []);

  // Simulate order progress
  useEffect(() => {
    if (orderStatus === 'preparing') {
      const timer = setTimeout(() => {
        setOrderStatus('delivering');
        toast.success("Your order is on the way! 🚗");
      }, 5000); // 5 seconds preparing
      return () => clearTimeout(timer);
    } else if (orderStatus === 'delivering') {
      const timer = setTimeout(() => {
        setOrderStatus('delivered');
        toast.success("Order delivered! Enjoy your meal! 🎉", {
          duration: 5000,
        });
      }, 8000); // 8 seconds delivering
      return () => clearTimeout(timer);
    }
  }, [orderStatus]);

  const addToCart = (food: FoodItem) => {
    const existing = cart.find(item => item.id === food.id);
    if (existing) {
      setCart(cart.map(item =>
        item.id === food.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...food, quantity: 1 }]);
    }
    toast.success(`${food.name} added to cart!`);
  };

  const updateQuantity = (id: string, change: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
    toast.success("Item removed from cart");
  };

  const getTotalCalories = () => {
    return cart.reduce((sum, item) => sum + (item.calories * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const placeOrder = () => {
    if (cart.length === 0) return;

    const prepTime = 10 + Math.floor(Math.random() * 10); // 10-20 min
    const deliveryTime = Math.floor(deliveryDistance * 2.5); // ~2.5 min per km
    setEstimatedTime(prepTime + deliveryTime);

    setOrderStatus('preparing');
    setCartOpen(false);
    toast.success(`Order placed! Estimated time: ${prepTime + deliveryTime} minutes`, {
      duration: 4000,
    });
  };

  const resetOrder = () => {
    setCart([]);
    setOrderStatus('idle');
    setEstimatedTime(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Utensils className="h-7 w-7 text-primary" />
            <div>
              <h1 className="font-bold text-xl">Wolt Food</h1>
              <p className="text-xs text-muted-foreground">Powered by AI</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="relative"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Button>

            {onLogout && (
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Switch</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Order Status Banner */}
      {orderStatus !== 'idle' && (
        <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {orderStatus === 'preparing' && (
                  <>
                    <Package className="h-5 w-5 animate-pulse" />
                    <div>
                      <p className="font-semibold">Preparing your order...</p>
                      <p className="text-sm opacity-90">The restaurant is working on your food</p>
                    </div>
                  </>
                )}
                {orderStatus === 'delivering' && (
                  <>
                    <Clock className="h-5 w-5 animate-pulse" />
                    <div>
                      <p className="font-semibold">On the way! 🚗</p>
                      <p className="text-sm opacity-90">Estimated arrival: {estimatedTime} minutes</p>
                    </div>
                  </>
                )}
                {orderStatus === 'delivered' && (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <div>
                      <p className="font-semibold">Delivered! Enjoy your meal! 🎉</p>
                      <p className="text-sm opacity-90">Thank you for your order</p>
                    </div>
                  </>
                )}
              </div>
              {orderStatus === 'delivered' && (
                <Button variant="secondary" size="sm" onClick={resetOrder}>
                  Order Again
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {restaurantFoods.length === 0 ? (
          /* Empty State */
          <div className="max-w-2xl mx-auto text-center py-20">
            <Card className="p-12">
              <Utensils className="h-20 w-20 mx-auto mb-6 text-muted-foreground opacity-50" />
              <h2 className="text-3xl font-bold mb-4">No Menu Items Yet</h2>
              <p className="text-muted-foreground text-lg mb-6">
                The restaurant hasn't added any food items yet. Check back soon!
              </p>
              <p className="text-sm text-muted-foreground">
                Restaurant owners can add menu items with AI-powered calorie detection.
              </p>
            </Card>
          </div>
        ) : (
          /* Food Menu Grid */
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Available Menu</h2>
              <p className="text-muted-foreground">
                {restaurantFoods.length} delicious {restaurantFoods.length === 1 ? 'item' : 'items'} ready to order
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurantFoods.map((food) => (
                <Card key={food.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className="relative overflow-hidden">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      {food.calories} cal
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-xl mb-3">{food.name}</h3>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="bg-blue-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-blue-700 font-medium">Protein</p>
                        <p className="text-lg font-bold text-blue-600">{food.protein}g</p>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-orange-700 font-medium">Carbs</p>
                        <p className="text-lg font-bold text-orange-600">{food.carbs}g</p>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-yellow-700 font-medium">Fat</p>
                        <p className="text-lg font-bold text-yellow-600">{food.fat}g</p>
                      </div>
                    </div>

                    {food.breakdown && food.breakdown.length > 0 && (
                      <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs font-semibold text-muted-foreground mb-2">INCLUDES:</p>
                        {food.breakdown.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="text-xs text-muted-foreground mb-1">
                            • {item.item} <span className="text-green-600 font-medium">({item.calories} cal)</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {food.notes && (
                      <p className="text-xs text-muted-foreground italic mb-4 line-clamp-2">
                        💡 {food.notes}
                      </p>
                    )}

                    <div className="flex items-center gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => addToCart(food)}
                        disabled={orderStatus !== 'idle'}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <div className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded font-medium">
                        {food.confidence}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Shopping Cart Sidebar */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Your Cart ({getTotalItems()} items)
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Your cart is empty</p>
                <p className="text-sm text-muted-foreground mt-2">Add some delicious items!</p>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-3">
                  {cart.map((item) => (
                    <Card key={item.id} className="p-4">
                      <div className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold">{item.name}</h4>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-green-600 font-medium mb-2">
                            {item.calories} cal × {item.quantity} = {item.calories * item.quantity} cal
                          </p>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="font-semibold w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Cart Summary */}
                <Card className="p-4 bg-muted">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Items:</span>
                      <span className="font-semibold">{getTotalItems()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Calories:</span>
                      <span className="font-semibold text-green-600">{getTotalCalories()} cal</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Est. Delivery:</span>
                      <span className="font-semibold">30-40 min</span>
                    </div>
                  </div>
                </Card>

                {/* Place Order Button */}
                <Button
                  className="w-full h-12 text-lg"
                  size="lg"
                  onClick={placeOrder}
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Place Order
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setCart([])}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Index;
