import { useState } from 'react';
import { Upload, Camera, Loader2 } from 'lucide-react';

export default function CalorieScanner() {
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setResult(null);
            setError(null);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setResult(null);
            setError(null);
        }
    };

    const analyzeImage = async () => {
        if (!image) return;

        setLoading(true);
        setError(null);

        try {
            const base64Image = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve((reader.result as string).split(',')[1]);
                reader.onerror = reject;
                reader.readAsDataURL(image);
            });

            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: base64Image,
                    mediaType: image.type,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Show user-friendly error messages
                if (response.status === 503) {
                    throw new Error('🔄 AI service is busy. Please wait 5 seconds and try again.');
                }
                if (response.status === 429) {
                    throw new Error('⏱️ Too many requests. Please wait 30 seconds and try again.');
                }
                throw new Error(data.userMessage || data.error || 'Failed to analyze image');
            }

            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to analyze image');
            console.error('Analysis error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <Camera className="w-10 h-10 text-green-600" />
                        <h1 className="text-4xl font-bold text-gray-800">Food Calorie Scanner</h1>
                    </div>
                    <p className="text-gray-600">Upload a photo of your food to get instant calorie estimates</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        className="border-3 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-green-500 transition-colors cursor-pointer"
                    >
                        {preview ? (
                            <div className="space-y-4">
                                <img src={preview} alt="Preview" className="max-h-96 mx-auto rounded-lg shadow-md" />
                                <label className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer transition-colors">
                                    <Upload className="w-5 h-5" />
                                    Change Image
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                </label>
                            </div>
                        ) : (
                            <label className="cursor-pointer">
                                <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                <p className="text-xl font-semibold text-gray-700 mb-2">
                                    Drop an image here or click to upload
                                </p>
                                <p className="text-gray-500">Supports JPG, PNG, WebP</p>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>
                        )}
                    </div>

                    {preview && (
                        <button
                            onClick={analyzeImage}
                            disabled={loading}
                            className="w-full mt-6 px-8 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-3 text-lg"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Camera className="w-6 h-6" />
                                    Analyze Food
                                </>
                            )}
                        </button>
                    )}

                    {error && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700 font-semibold">Error: {error}</p>
                        </div>
                    )}

                    {result && (
                        <div className="mt-8 space-y-6">
                            <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-white">
                                <h2 className="text-2xl font-bold mb-2">Total Calories</h2>
                                <p className="text-5xl font-bold">{result.totalCalories}</p>
                                <p className="text-green-100 mt-2">Confidence: {result.confidence}</p>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-blue-50 rounded-lg p-4 text-center">
                                    <p className="text-gray-600 text-sm font-semibold">Protein</p>
                                    <p className="text-2xl font-bold text-blue-600">{result.protein}g</p>
                                </div>
                                <div className="bg-orange-50 rounded-lg p-4 text-center">
                                    <p className="text-gray-600 text-sm font-semibold">Carbs</p>
                                    <p className="text-2xl font-bold text-orange-600">{result.carbs}g</p>
                                </div>
                                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                                    <p className="text-gray-600 text-sm font-semibold">Fat</p>
                                    <p className="text-2xl font-bold text-yellow-600">{result.fat}g</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Breakdown</h3>
                                <div className="space-y-3">
                                    {result.breakdown.map((item: any, idx: number) => (
                                        <div key={idx} className="flex justify-between items-center p-3 bg-white rounded-lg">
                                            <div>
                                                <p className="font-semibold text-gray-800">{item.item}</p>
                                                <p className="text-sm text-gray-500">{item.portion}</p>
                                            </div>
                                            <p className="text-lg font-bold text-green-600">{item.calories} cal</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {result.notes && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-gray-700">
                                        <span className="font-semibold">Note:</span> {result.notes}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-6 text-center text-sm text-gray-600">
                    <p>Estimates are approximate and based on visual analysis. For precise tracking, use a food scale.</p>
                </div>
            </div>
        </div>
    );
}
