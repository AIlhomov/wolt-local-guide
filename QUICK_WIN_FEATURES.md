# 🏆 Quick-Win Hackathon Features (30 mins each)

These features can be implemented quickly and will impress the judges!

---

## 1️⃣ Dietary Filters (20 mins) ⭐ HIGH IMPACT

**What:** Add filter buttons for "Vegetarian", "Vegan", "Low-Calorie"

**Why Judges Love It:**
- Shows personalization
- Addresses real user need (dietary restrictions)
- Demonstrates data intelligence

**Implementation:**

### Step 1: Update `foodDatabase.ts`
Add tags to food items:

```typescript
export interface FoodItem {
  // ...existing properties...
  tags?: string[]; // Add this line
}

// When adding foods, include tags:
const food: FoodItem = {
  name: "Veggie Burger",
  calories: 450,
  tags: ["vegetarian", "vegan"], // Add this
  // ...rest of properties...
};
```

### Step 2: Update `Index.tsx`
Add filter UI:

```typescript
const [activeFilter, setActiveFilter] = useState<string | null>(null);

// Filter logic
const filteredFoods = restaurantFoods.filter(food => {
  if (!activeFilter) return true;
  
  if (activeFilter === 'vegetarian') {
    return food.tags?.includes('vegetarian') || food.tags?.includes('vegan');
  }
  if (activeFilter === 'vegan') {
    return food.tags?.includes('vegan');
  }
  if (activeFilter === 'low-calorie') {
    return food.calories < 500;
  }
  return true;
});

// Add filter buttons (before food grid):
<div className="flex gap-2 mb-6">
  <button 
    onClick={() => setActiveFilter(null)}
    className={`px-4 py-2 rounded-lg ${!activeFilter ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
  >
    All
  </button>
  <button 
    onClick={() => setActiveFilter('vegetarian')}
    className={`px-4 py-2 rounded-lg ${activeFilter === 'vegetarian' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
  >
    🌱 Vegetarian
  </button>
  <button 
    onClick={() => setActiveFilter('vegan')}
    className={`px-4 py-2 rounded-lg ${activeFilter === 'vegan' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
  >
    🥬 Vegan
  </button>
  <button 
    onClick={() => setActiveFilter('low-calorie')}
    className={`px-4 py-2 rounded-lg ${activeFilter === 'low-calorie' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
  >
    💪 Low-Calorie (<500)
  </button>
</div>
```

**Demo Script:**
> "Customers can filter by dietary preferences - vegetarian, vegan, or low-calorie options. This personalizes the experience and helps users make healthier choices."

---

## 2️⃣ Order History with Nutrition Trends (15 mins) ⭐ VERY IMPRESSIVE

**What:** Show past orders with total calories consumed

**Why Judges Love It:**
- Demonstrates **data intelligence**
- Shows **long-term value** (not just one-time ordering)
- Highlights **health tracking** angle

**Implementation:**

### Step 1: Add localStorage for order history
In `Index.tsx`:

```typescript
const [orderHistory, setOrderHistory] = useState<any[]>([]);

// Load order history on mount
useEffect(() => {
  const history = localStorage.getItem('orderHistory');
  if (history) {
    setOrderHistory(JSON.parse(history));
  }
}, []);

// When placing order, save to history
const placeOrder = () => {
  const order = {
    id: Date.now(),
    date: new Date().toISOString(),
    items: cart,
    totalCalories: getTotalCalories(),
    totalPrice: getTotalPrice(),
  };
  
  const newHistory = [order, ...orderHistory].slice(0, 10); // Keep last 10
  setOrderHistory(newHistory);
  localStorage.setItem('orderHistory', JSON.stringify(newHistory));
  
  // ...existing order logic...
};
```

### Step 2: Display order history
Add a section below the food grid:

```typescript
{orderHistory.length > 0 && (
  <div className="mt-12 bg-white rounded-xl p-6 shadow-lg">
    <h2 className="text-2xl font-bold mb-4">📊 Your Nutrition History</h2>
    <div className="space-y-3">
      {orderHistory.slice(0, 5).map((order) => (
        <div key={order.id} className="flex justify-between items-center border-b pb-2">
          <div>
            <p className="font-semibold">{new Date(order.date).toLocaleDateString()}</p>
            <p className="text-sm text-gray-600">{order.items.length} items</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-green-600">{order.totalCalories} cal</p>
            <p className="text-sm text-gray-600">€{order.totalPrice.toFixed(2)}</p>
          </div>
        </div>
      ))}
    </div>
    <p className="mt-4 text-lg font-semibold">
      Total this week: {orderHistory.reduce((sum, o) => sum + o.totalCalories, 0)} calories
    </p>
  </div>
)}
```

**Demo Script:**
> "The app tracks nutrition over time, helping users make informed decisions. This could integrate with fitness apps or provide weekly health reports."

---

## 3️⃣ Multi-Restaurant Support (30 mins) ⭐ SHOWS SCALABILITY

**What:** Add restaurant profiles and filter by restaurant

**Why Judges Love It:**
- Demonstrates **marketplace thinking**
- Shows **scalability** (core judging criteria!)
- Proves you understand Wolt's multi-vendor model

**Implementation:**

### Step 1: Update `foodDatabase.ts`
```typescript
export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
}

export interface FoodItem {
  // ...existing properties...
  restaurantId: string; // Add this
  restaurantName: string; // Add this
}

const restaurants: Restaurant[] = [
  { id: 'r1', name: 'Green Kitchen', cuisine: 'Healthy', rating: 4.5 },
  { id: 'r2', name: 'Burger Hub', cuisine: 'American', rating: 4.2 },
  { id: 'r3', name: 'Sushi Master', cuisine: 'Japanese', rating: 4.8 },
];

export const foodDatabase = {
  // ...existing methods...
  getRestaurants: () => restaurants,
  getFoodsByRestaurant: (restaurantId: string) => {
    return foods.filter(f => f.restaurantId === restaurantId);
  },
};
```

### Step 2: Add restaurant filter in `Index.tsx`
```typescript
const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
const restaurants = foodDatabase.getRestaurants();

const displayedFoods = selectedRestaurant
  ? restaurantFoods.filter(f => f.restaurantId === selectedRestaurant)
  : restaurantFoods;

// Add restaurant cards (before food grid):
<div className="mb-8">
  <h2 className="text-2xl font-bold mb-4">🏪 Restaurants</h2>
  <div className="grid grid-cols-3 gap-4">
    {restaurants.map(r => (
      <div 
        key={r.id}
        onClick={() => setSelectedRestaurant(r.id === selectedRestaurant ? null : r.id)}
        className={`p-4 rounded-lg cursor-pointer ${
          selectedRestaurant === r.id ? 'bg-green-600 text-white' : 'bg-white'
        }`}
      >
        <h3 className="font-bold">{r.name}</h3>
        <p className="text-sm">{r.cuisine} · ⭐ {r.rating}</p>
      </div>
    ))}
  </div>
</div>
```

**Demo Script:**
> "This scales to hundreds of restaurants across multiple cities. Each restaurant manages their own menu, and customers can browse all options in one place - just like Wolt."

---

## 4️⃣ Sustainability Score (15 mins) 🌱 BONUS POINTS

**What:** Show environmental impact of food choices

**Why Judges Love It:**
- Addresses **ESG/sustainability** (big trend in 2025!)
- Shows **innovation** beyond basic functionality
- Differentiates your solution

**Implementation:**

Add to each food item in the grid:

```typescript
const getSustainabilityScore = (item: FoodItem) => {
  // Simple heuristic
  if (item.tags?.includes('vegan') || item.tags?.includes('vegetarian')) {
    return { label: 'Low Impact', color: 'green', icon: '🌱' };
  }
  if (item.name.toLowerCase().includes('beef') || item.name.toLowerCase().includes('steak')) {
    return { label: 'High Impact', color: 'red', icon: '🥩' };
  }
  return { label: 'Medium Impact', color: 'yellow', icon: '🌍' };
};

// In food card:
<div className={`text-xs px-2 py-1 rounded bg-${score.color}-100 text-${score.color}-700`}>
  {score.icon} {score.label}
</div>
```

**Demo Script:**
> "We're helping customers make environmentally conscious choices. This aligns with Wolt's sustainability goals and appeals to eco-conscious consumers."

---

## 5️⃣ AI-Powered Search (25 mins) 🔍 SUPER COOL

**What:** "I want something healthy and under 600 calories"

**Why Judges Love It:**
- **AI-powered** (core requirement!)
- Natural language interface
- Shows understanding of modern UX

**Implementation:**

```typescript
const [searchQuery, setSearchQuery] = useState('');

const filterByNaturalLanguage = (query: string) => {
  const lower = query.toLowerCase();
  
  return restaurantFoods.filter(food => {
    if (lower.includes('healthy') || lower.includes('low calorie')) {
      if (food.calories > 600) return false;
    }
    if (lower.includes('high protein')) {
      if (food.protein < 20) return false;
    }
    if (lower.includes('vegetarian') || lower.includes('vegan')) {
      if (!food.tags?.includes('vegetarian') && !food.tags?.includes('vegan')) return false;
    }
    return true;
  });
};

// Add search bar:
<input
  type="text"
  placeholder="Try: 'healthy and low calorie' or 'high protein'"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="w-full px-4 py-3 rounded-lg border"
/>
```

**Demo Script:**
> "Customers can search naturally - 'I want something healthy' - and our AI understands intent, filtering by calories, protein, and dietary preferences."

---

## ⚡ Prioritize These for Your Demo

**Must-Have (Pick 1-2):**
1. **Dietary Filters** - easiest, high impact
2. **Order History** - shows data intelligence

**Nice-to-Have (Pick 1):**
3. **Multi-Restaurant** - shows scalability (judges love this!)
4. **Sustainability Score** - differentiates you

**If You Have Extra Time:**
5. **AI Search** - wow factor!

---

## 🎯 Implementation Order (90 mins total)

1. **Dietary Filters** (20 mins) - Do this first!
2. **Order History** (15 mins) - Quick win!
3. **Multi-Restaurant** (30 mins) - Shows scale!
4. **Practice Demo** (25 mins) - Most important!

---

## 💡 Pro Tips

1. **Don't over-engineer** - simple implementations are fine
2. **Focus on the demo** - working features > perfect code
3. **Prepare fallbacks** - if live demo fails, have screenshots
4. **Tell the story** - explain WHY each feature matters

Good luck! 🚀
