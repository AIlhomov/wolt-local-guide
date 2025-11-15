# 🍔 Restaurant Food Management System - User Guide

## 🎯 Overview

This app allows restaurant owners to add food items with automatic calorie detection, and customers to browse and order from the menu.

## 🚀 Features

### For Restaurant Owners:
- ✅ Add food items with images
- 🔍 Automatic calorie scanning using AI (Gemini)
- 📊 Get detailed nutritional breakdown (protein, carbs, fat)
- 📝 View all published food items
- 🗑️ Delete food items
- 🔄 Switch between owner and customer view

### For Customers:
- 👀 View all restaurant menu items
- 📊 See calorie information for each dish
- 💪 View macronutrient breakdown
- 📱 Beautiful card-based UI
- 🛒 Order food (button ready for integration)
- 🔄 Switch to restaurant owner view

## 📖 How to Use

### 1. **Login Screen**
When you start the app, you'll see two options:
- **I'm a Customer** - Browse and order food
- **I'm a Restaurant Owner** - Manage your menu

Just click one to continue - no username/password needed!

### 2. **Restaurant Owner Dashboard**

#### Adding a Food Item:
1. Enter the **food name** (e.g., "Margherita Pizza")
2. **Upload an image** by clicking or drag & drop
3. Click **"Scan for Calories"** - AI analyzes the image
4. Review the automatic calorie and nutrition data
5. Click **"Publish Food Item"** to add to menu

#### The AI Scanner Provides:
- Total calories
- Protein (grams)
- Carbs (grams)
- Fat (grams)
- Breakdown of items in the dish
- Confidence level (high/medium/low)
- Additional notes

#### Managing Items:
- View all your published foods on the right side
- Click the trash icon to delete an item
- All changes are saved automatically

#### Logout:
- Click **"Switch Account"** in the header to go back to login

### 3. **Customer View**

#### Browsing Menu:
- All restaurant food items appear at the top
- Each card shows:
  - Food image
  - Food name
  - Total calories (big and bold!)
  - Protein, carbs, fat
  - Breakdown of what's in the dish
  - AI notes about the estimate
  - Confidence level

#### Ordering:
- Click **"Order Now"** button on any food card
- (In production, this would connect to payment/cart system)

#### Logout:
- Click **"Switch Account"** in the header to go back to login

## 🗄️ Data Storage

Currently using **localStorage** for simplicity:
- All food items are stored in your browser
- Data persists across page refreshes
- Easy to upgrade to real database (Firebase, Supabase, etc.)

To clear all data, open browser console and run:
```javascript
localStorage.removeItem('wolt_food_items')
```

## 🔧 Technical Details

### Database Schema (localStorage)
```typescript
{
  id: string,              // Unique ID
  name: string,            // Food name
  image: string,           // Base64 image
  calories: number,        // Total calories
  protein: number,         // Protein in grams
  carbs: number,           // Carbs in grams
  fat: number,             // Fat in grams
  breakdown: Array<{       // Detailed breakdown
    item: string,
    calories: number,
    portion: string
  }>,
  confidence: string,      // "high", "medium", "low"
  notes: string,           // AI notes
  restaurantId: string,    // Restaurant identifier
  createdAt: string        // ISO timestamp
}
```

### API Endpoint
- **POST /api/analyze** - Scan food image for calories
  - Input: `{ image: base64, mediaType: string }`
  - Output: Nutrition data from Gemini AI

## 🎨 UI Components Used

- **shadcn/ui** components (Button, Card, Input)
- **Lucide React** icons
- **Sonner** for toast notifications
- **Tailwind CSS** for styling

## 🚀 Future Enhancements

Potential features to add:
- [ ] Multiple restaurant support
- [ ] User authentication (real login)
- [ ] Shopping cart & checkout
- [ ] Order history
- [ ] Real-time database (Firebase/Supabase)
- [ ] Price information
- [ ] Restaurant profiles
- [ ] Customer reviews
- [ ] Dietary filters (vegan, gluten-free, etc.)
- [ ] Allergen information

## 🐛 Troubleshooting

### Food items not showing up?
- Make sure you've published at least one item as restaurant owner
- Check browser console for errors
- Try refreshing the page

### Calorie scanning not working?
- Check that the server is running (`npm start`)
- Verify API key in `.env` file
- Check terminal for error messages
- Try with a different, clearer image

### Lost all data?
- localStorage is browser-specific
- Data is cleared when you clear browser cache
- Consider backing up to a real database

## 📝 Notes

- The AI calorie estimates are approximate
- Image quality affects accuracy
- Gemini API has rate limits (15 requests/minute)
- All changes are instant (no page reload needed)
