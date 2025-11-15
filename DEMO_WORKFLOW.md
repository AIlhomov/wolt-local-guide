# 🎬 Demo Workflow - Quick Start Guide

## ✨ Test the Complete Flow

Follow these steps to see the entire system in action:

### Step 1: Start as Restaurant Owner (30 seconds)

1. Open http://localhost:8080
2. Click **"I'm a Restaurant Owner"**
3. You'll see the dashboard with:
   - Left: Form to add food
   - Right: List of published foods (empty at first)

### Step 2: Add Your First Food Item (1 minute)

1. **Enter food name:** "Chicken Burger"
2. **Upload image:** Use `/home/abduvohidilhomov/junction2025/burger.jpeg` or any food photo
3. **Click "Scan for Calories"** - Wait 2-3 seconds
4. **See the magic!** 🎉
   - AI detects: Total calories, protein, carbs, fat
   - Shows breakdown of items
   - Confidence level
5. **Click "Publish Food Item"**
6. See your food appear on the right side!

### Step 3: Add More Items (Optional)

Try adding these types of foods to test:
- Pizza slice
- Salad
- Dessert
- Drink
- Mixed plate

### Step 4: Switch to Customer View (10 seconds)

1. Click **"Switch Account"** button in header
2. Select **"I'm a Customer"**
3. **Boom!** See all the food you just added

### Step 5: Browse as Customer

You'll see:
- 📸 All food images
- 🔢 Calorie counts
- 💪 Nutrition info (protein, carbs, fat)
- 📝 AI-generated breakdown
- 🛒 "Order Now" buttons

### Step 6: Switch Back (Anytime)

Click **"Switch Account"** → Choose role → Instant switch!

---

## 🎯 Quick Test Checklist

- [ ] Login screen shows both options
- [ ] Can click to choose role (no form needed)
- [ ] Restaurant dashboard loads
- [ ] Can upload an image
- [ ] Scan button works (shows loading)
- [ ] AI returns calorie data
- [ ] Can publish food item
- [ ] Food appears in the list
- [ ] Can delete a food item
- [ ] Switch Account button works
- [ ] Customer view shows all foods
- [ ] Food cards look good
- [ ] Can switch back to owner

---

## 🎨 What You'll See

### Restaurant Owner View:
```
┌────────────────────────────────────────────┐
│  Restaurant Dashboard    [Switch Account]  │
├─────────────────┬──────────────────────────┤
│                 │                          │
│  Add New Food   │   Published Foods (3)    │
│                 │                          │
│  [Name Input]   │   ┌──────────────────┐  │
│  [Image Upload] │   │ 🍔 Burger        │  │
│  [Scan Button]  │   │ 450 cal | P:25g  │  │
│                 │   └──────────────────┘  │
│  ✅ 450 cal     │                          │
│  P:25g C:35g    │   ┌──────────────────┐  │
│  [Publish]      │   │ 🍕 Pizza         │  │
│                 │   │ 680 cal | P:30g  │  │
└─────────────────┴──────────────────────────┘
```

### Customer View:
```
┌────────────────────────────────────────────┐
│  Wolt AI                 [Switch Account]  │
├────────────────────────────────────────────┤
│                                            │
│  🍽️ Restaurant Menu (3 items)             │
│                                            │
│  ┌─────────────┐  ┌─────────────┐         │
│  │   [Image]   │  │   [Image]   │         │
│  │   Burger    │  │   Pizza     │         │
│  │   450 cal   │  │   680 cal   │         │
│  │ 🥩 25g      │  │ 🥩 30g      │         │
│  │ [Order Now] │  │ [Order Now] │         │
│  └─────────────┘  └─────────────┘         │
└────────────────────────────────────────────┘
```

---

## 💡 Pro Tips

1. **Best Images:** Use clear, well-lit photos with food centered
2. **Multiple Items:** Can add unlimited food items
3. **Real-Time:** Changes appear instantly, no refresh needed
4. **Persistent:** Data saved in browser, survives page reload
5. **Mobile-Friendly:** Works on phone/tablet too!

---

## 🚀 You're Ready!

The app is running at: **http://localhost:8080**

Enjoy testing! 🎉
