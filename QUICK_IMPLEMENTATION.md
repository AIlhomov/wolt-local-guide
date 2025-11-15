# 🚀 Quick Implementation Guide - Top 3 Features

## Priority Features for Maximum Impact (2-3 hours)

---

## 1. 🏪 Multi-Restaurant Support (45 min)

### Step 1: Update Food Database
Add to `src/lib/foodDatabase.ts`:
```typescript
export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  logo?: string;
  description: string;
}

export const restaurantDatabase = {
  getAllRestaurants(): Restaurant[] {
    const data = localStorage.getItem('wolt_restaurants');
    return data ? JSON.parse(data) : [
      {
        id: 'rest_1',
        name: 'Healthy Bowl Co.',
        cuisine: 'Health Food',
        description: 'Fresh, nutritious bowls',
      },
      {
        id: 'rest_2',
        name: 'Burger Paradise',
        cuisine: 'American',
        description: 'Classic burgers & fries',
      },
      {
        id: 'rest_3',
        name: 'Green Leaf Cafe',
        cuisine: 'Vegan',
        description: 'Plant-based goodness',
      },
    ];
  },
};
```

### Step 2: Add Restaurant Selector to Customer Page
In `Index.tsx`, add restaurant filtering:
```typescript
const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
const restaurants = restaurantDatabase.getAllRestaurants();

const filteredFoods = selectedRestaurant
  ? restaurantFoods.filter(f => f.restaurantId === selectedRestaurant)
  : restaurantFoods;

// Add restaurant tabs above food grid
<Tabs value={selectedRestaurant || 'all'} onValueChange={setSelectedRestaurant}>
  <TabsList>
    <TabsTrigger value="all">All Restaurants</TabsTrigger>
    {restaurants.map(r => (
      <TabsTrigger key={r.id} value={r.id}>{r.name}</TabsTrigger>
    ))}
  </TabsList>
</Tabs>
```

### Step 3: Update Owner Dashboard
Let owner select restaurant when publishing:
```typescript
const [selectedRestaurant, setSelectedRestaurant] = useState('rest_1');

<Select value={selectedRestaurant} onValueChange={setSelectedRestaurant}>
  {restaurants.map(r => (
    <SelectItem value={r.id}>{r.name}</SelectItem>
  ))}
</Select>
```

---

## 2. 🥗 Dietary Filters (45 min)

### Step 1: Update Food Interface
Add to Gemini prompt in `server/proxy.js`:
```javascript
text: `Analyze this food image and provide a detailed calorie estimate. Return ONLY a valid JSON object with this exact structure:
{
  "foods": ["food1", "food2"],
  "totalCalories": 500,
  "breakdown": [...],
  "protein": 20,
  "carbs": 50,
  "fat": 15,
  "confidence": "high",
  "notes": "...",
  "dietaryTags": ["vegetarian", "gluten-free"],
  "allergens": ["dairy", "nuts"]
}`
```

### Step 2: Add Filter UI
In `Index.tsx`:
```typescript
const [filters, setFilters] = useState({
  maxCalories: 2000,
  diet: 'all',
  hideAllergens: [],
});

// Filter foods
const filteredFoods = restaurantFoods.filter(food => {
  if (food.calories > filters.maxCalories) return false;
  if (filters.diet !== 'all' && !food.dietaryTags?.includes(filters.diet)) return false;
  if (filters.hideAllergens.some(a => food.allergens?.includes(a))) return false;
  return true;
});

// Add filter panel
<Card className="p-4 mb-6">
  <h3 className="font-bold mb-4">Filters</h3>
  
  <div className="space-y-4">
    <div>
      <Label>Max Calories: {filters.maxCalories}</Label>
      <Slider 
        value={[filters.maxCalories]}
        onValueChange={([v]) => setFilters({...filters, maxCalories: v})}
        max={2000}
        step={50}
      />
    </div>

    <div>
      <Label>Dietary Preference</Label>
      <Select value={filters.diet} onValueChange={(v) => setFilters({...filters, diet: v})}>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="vegetarian">Vegetarian</SelectItem>
        <SelectItem value="vegan">Vegan</SelectItem>
        <SelectItem value="gluten-free">Gluten-Free</SelectItem>
      </Select>
    </div>

    <div>
      <Label>Hide Allergens</Label>
      <div className="flex gap-2">
        {['dairy', 'nuts', 'gluten', 'shellfish'].map(allergen => (
          <Checkbox
            key={allergen}
            checked={filters.hideAllergens.includes(allergen)}
            onCheckedChange={(checked) => {
              if (checked) {
                setFilters({...filters, hideAllergens: [...filters.hideAllergens, allergen]});
              } else {
                setFilters({...filters, hideAllergens: filters.hideAllergens.filter(a => a !== allergen)});
              }
            }}
          >
            {allergen}
          </Checkbox>
        ))}
      </div>
    </div>
  </div>
</Card>
```

---

## 3. 🤖 AI Recommendations (45 min)

### Step 1: Track Order History
In `Index.tsx`:
```typescript
const [orderHistory, setOrderHistory] = useState<FoodItem[]>([]);

// When order is placed
const placeOrder = () => {
  // ...existing code...
  
  // Add to history
  const orderedFoods = cart.flatMap(item => 
    Array(item.quantity).fill(item)
  );
  setOrderHistory([...orderHistory, ...orderedFoods]);
  localStorage.setItem('order_history', JSON.stringify([...orderHistory, ...orderedFoods]));
};
```

### Step 2: Calculate Recommendations
```typescript
function getRecommendations(history: FoodItem[], allFoods: FoodItem[]): FoodItem[] {
  if (history.length === 0) return allFoods.slice(0, 3);

  // Calculate user preferences
  const avgCalories = history.reduce((sum, f) => sum + f.calories, 0) / history.length;
  const avgProtein = history.reduce((sum, f) => sum + f.protein, 0) / history.length;
  const avgCarbs = history.reduce((sum, f) => sum + f.carbs, 0) / history.length;

  // Score each food by similarity
  return allFoods
    .map(food => ({
      ...food,
      score: 
        (1 - Math.abs(food.calories - avgCalories) / avgCalories) * 0.4 +
        (1 - Math.abs(food.protein - avgProtein) / avgProtein) * 0.3 +
        (1 - Math.abs(food.carbs - avgCarbs) / avgCarbs) * 0.3
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

const recommendations = getRecommendations(orderHistory, restaurantFoods);
```

### Step 3: Display Recommendations
```tsx
{recommendations.length > 0 && (
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-4">
      <Sparkles className="h-6 w-6 text-primary" />
      <h2 className="text-2xl font-bold">Recommended for You</h2>
    </div>
    <p className="text-muted-foreground mb-6">
      Based on your nutrition preferences
    </p>
    <div className="grid sm:grid-cols-3 gap-4">
      {recommendations.map(food => (
        <Card key={food.id} className="p-4 border-2 border-primary/20">
          <div className="relative">
            <img src={food.image} alt={food.name} className="w-full h-32 object-cover rounded" />
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-bold">
              ⭐ Match
            </div>
          </div>
          <h4 className="font-bold mt-2">{food.name}</h4>
          <p className="text-sm text-green-600 font-medium">{food.calories} cal</p>
          <Button size="sm" className="w-full mt-2" onClick={() => addToCart(food)}>
            Add to Cart
          </Button>
        </Card>
      ))}
    </div>
  </div>
)}
```

---

## 4. 📊 BONUS: Simple Analytics Dashboard (30 min)

Add a stats card to customer view:
```tsx
<Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
  <h3 className="text-lg font-bold mb-4">Your Nutrition Stats</h3>
  <div className="grid grid-cols-3 gap-4">
    <div className="text-center">
      <p className="text-3xl font-bold text-primary">{orderHistory.length}</p>
      <p className="text-sm text-muted-foreground">Orders</p>
    </div>
    <div className="text-center">
      <p className="text-3xl font-bold text-green-600">
        {Math.round(orderHistory.reduce((s, f) => s + f.calories, 0) / orderHistory.length) || 0}
      </p>
      <p className="text-sm text-muted-foreground">Avg Calories</p>
    </div>
    <div className="text-center">
      <p className="text-3xl font-bold text-blue-600">
        {Math.round(orderHistory.reduce((s, f) => s + f.protein, 0) / orderHistory.length) || 0}g
      </p>
      <p className="text-sm text-muted-foreground">Avg Protein</p>
    </div>
  </div>
</Card>
```

---

## 🎯 Implementation Order

### Phase 1 (First Hour):
1. ✅ Multi-restaurant support (basic version)
2. ✅ Update Gemini prompt for dietary tags
3. ✅ Add filter UI

### Phase 2 (Second Hour):
4. ✅ Order history tracking
5. ✅ Recommendation algorithm
6. ✅ Recommendation display

### Phase 3 (Third Hour):
7. ✅ Polish UI
8. ✅ Add analytics card
9. ✅ Test full flow
10. ✅ Prepare demo

---

## 🎤 Testing Checklist

Before demo:
- [ ] Add 3-4 foods from different "restaurants"
- [ ] Test each restaurant filter
- [ ] Test dietary filters
- [ ] Place 2-3 orders to build history
- [ ] Verify recommendations appear
- [ ] Test full order flow
- [ ] Screenshot key features

---

## 🚀 You're Ready!

With these 3 features, you'll have:
- ✅ **Scalability** (multi-restaurant)
- ✅ **Personalization** (AI recommendations)
- ✅ **User Impact** (dietary filters)
- ✅ **Technical Depth** (recommendation engine)

All judging criteria covered! 🎉
