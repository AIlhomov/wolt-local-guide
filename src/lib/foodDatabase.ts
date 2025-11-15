// Simple food database using localStorage
// In production, replace with a real database (Firebase, Supabase, etc.)

export interface FoodItem {
    id: string;
    name: string;
    image: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    breakdown: Array<{
        item: string;
        calories: number;
        portion: string;
    }>;
    confidence: string;
    notes?: string;
    restaurantId: string;
    createdAt: string;
}

const STORAGE_KEY = 'wolt_food_items';

export const foodDatabase = {
    // Get all food items
    getAllFoods(): FoodItem[] {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    // Get foods by restaurant
    getFoodsByRestaurant(restaurantId: string): FoodItem[] {
        const foods = this.getAllFoods();
        return foods.filter(food => food.restaurantId === restaurantId);
    },

    // Add a new food item
    addFood(food: Omit<FoodItem, 'id' | 'createdAt'>): FoodItem {
        const foods = this.getAllFoods();
        const newFood: FoodItem = {
            ...food,
            id: `food_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString(),
        };
        foods.push(newFood);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(foods));
        return newFood;
    },

    // Delete a food item
    deleteFood(id: string): void {
        const foods = this.getAllFoods();
        const filtered = foods.filter(food => food.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    },

    // Update a food item
    updateFood(id: string, updates: Partial<FoodItem>): FoodItem | null {
        const foods = this.getAllFoods();
        const index = foods.findIndex(food => food.id === id);
        if (index === -1) return null;

        foods[index] = { ...foods[index], ...updates };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(foods));
        return foods[index];
    },

    // Clear all foods (for testing)
    clearAll(): void {
        localStorage.removeItem(STORAGE_KEY);
    },
};
