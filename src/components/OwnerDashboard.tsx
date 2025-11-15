import { useState, useEffect } from "react";
import { Upload, Camera, Loader2, LogOut, Trash2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { foodDatabase, FoodItem } from "@/lib/foodDatabase";
import { toast } from "sonner";

interface OwnerDashboardProps {
    onLogout: () => void;
}

export const OwnerDashboard = ({ onLogout }: OwnerDashboardProps) => {
    const [foodName, setFoodName] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [base64Image, setBase64Image] = useState<string | null>(null); // Store base64 for saving
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState<any>(null);
    const [foodList, setFoodList] = useState<FoodItem[]>([]);

    // Load existing foods on mount
    useEffect(() => {
        const foods = foodDatabase.getAllFoods();
        setFoodList(foods);
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            // Create blob URL for preview
            setPreview(URL.createObjectURL(file));
            
            // Also convert to base64 for storage
            const reader = new FileReader();
            reader.onload = () => {
                setBase64Image(reader.result as string);
            };
            reader.readAsDataURL(file);
            
            setScanResult(null);
        }
    };

    const handleScanImage = async () => {
        if (!imageFile) return;

        setScanning(true);
        setScanResult(null);

        try {
            const base64Image = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve((reader.result as string).split(',')[1]);
                reader.onerror = reject;
                reader.readAsDataURL(imageFile);
            });

            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: base64Image,
                    mediaType: imageFile.type,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to scan image');
            }

            setScanResult(data);
            toast.success("Image scanned successfully!");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to scan image');
            console.error('Scan error:', err);
        } finally {
            setScanning(false);
        }
    };

    const handlePublish = () => {
        if (!foodName.trim() || !base64Image || !scanResult) {
            toast.error("Please fill all fields and scan the image first");
            return;
        }

        const newFood = foodDatabase.addFood({
            name: foodName,
            image: base64Image, // Use base64 instead of blob URL
            calories: scanResult.totalCalories,
            protein: scanResult.protein,
            carbs: scanResult.carbs,
            fat: scanResult.fat,
            breakdown: scanResult.breakdown,
            confidence: scanResult.confidence,
            notes: scanResult.notes,
            restaurantId: 'default_restaurant', // In real app, use actual restaurant ID
        });

        setFoodList([newFood, ...foodList]);

        // Reset form
        setFoodName("");
        setImageFile(null);
        setBase64Image(null);
        setPreview(null);
        setScanResult(null);

        toast.success("Food item published successfully!");
    };

    const handleDelete = (id: string) => {
        foodDatabase.deleteFood(id);
        setFoodList(foodList.filter(food => food.id !== id));
        toast.success("Food item deleted");
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Restaurant Dashboard</h1>
                    <Button variant="outline" onClick={onLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Switch Account
                    </Button>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left: Add Food Form */}
                    <div>
                        <Card className="p-6">
                            <h2 className="text-xl font-bold mb-6">Add New Food Item</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Food Name</label>
                                    <Input
                                        placeholder="e.g., Margherita Pizza"
                                        value={foodName}
                                        onChange={(e) => setFoodName(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">Upload Image</label>
                                    <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                                        {preview ? (
                                            <div className="space-y-4">
                                                <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                                                <label className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg cursor-pointer hover:bg-secondary/90">
                                                    <Upload className="w-4 h-4" />
                                                    Change Image
                                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                                </label>
                                            </div>
                                        ) : (
                                            <label className="cursor-pointer block">
                                                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                                <p className="text-lg font-medium mb-2">Drop image here or click to upload</p>
                                                <p className="text-sm text-muted-foreground">PNG, JPG, WebP supported</p>
                                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                {preview && !scanResult && (
                                    <Button
                                        onClick={handleScanImage}
                                        disabled={scanning}
                                        className="w-full"
                                        size="lg"
                                    >
                                        {scanning ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Scanning Image...
                                            </>
                                        ) : (
                                            <>
                                                <Camera className="w-5 h-5 mr-2" />
                                                Scan for Calories
                                            </>
                                        )}
                                    </Button>
                                )}

                                {scanResult && (
                                    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                            <span className="font-semibold text-green-900">Scan Complete!</span>
                                        </div>
                                        <div className="grid grid-cols-4 gap-3 text-center">
                                            <div>
                                                <div className="text-2xl font-bold text-green-600">{scanResult.totalCalories}</div>
                                                <div className="text-xs text-green-800">Calories</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-blue-600">{scanResult.protein}g</div>
                                                <div className="text-xs text-blue-800">Protein</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-orange-600">{scanResult.carbs}g</div>
                                                <div className="text-xs text-orange-800">Carbs</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-yellow-600">{scanResult.fat}g</div>
                                                <div className="text-xs text-yellow-800">Fat</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <Button
                                    onClick={handlePublish}
                                    disabled={!foodName.trim() || !preview || !scanResult}
                                    className="w-full"
                                    size="lg"
                                >
                                    Publish Food Item
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* Right: Published Foods */}
                    <div>
                        <h2 className="text-xl font-bold mb-4">Published Foods ({foodList.length})</h2>
                        <div className="space-y-4">
                            {foodList.length === 0 ? (
                                <Card className="p-8 text-center text-muted-foreground">
                                    <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>No food items yet. Add your first item!</p>
                                </Card>
                            ) : (
                                foodList.map((food) => (
                                    <Card key={food.id} className="p-4">
                                        <div className="flex gap-4">
                                            <img
                                                src={food.image}
                                                alt={food.name}
                                                className="w-24 h-24 object-cover rounded-lg"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg">{food.name}</h3>
                                                <div className="flex gap-4 text-sm mt-2">
                                                    <span className="text-green-600 font-semibold">{food.calories} cal</span>
                                                    <span className="text-muted-foreground">P: {food.protein}g</span>
                                                    <span className="text-muted-foreground">C: {food.carbs}g</span>
                                                    <span className="text-muted-foreground">F: {food.fat}g</span>
                                                </div>
                                                {food.notes && (
                                                    <p className="text-xs text-muted-foreground mt-2">{food.notes}</p>
                                                )}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(food.id)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
