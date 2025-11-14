import React, { useState } from "react";
import { restaurants } from "../lib/mockRestaurants";

const cuisines = ["Japanese", "Italian", "Thai", "American", "Vegan"];
const prices = ["$", "$$", "$$$"];

export const TasteProfileQuiz = ({ onRecommend }: { onRecommend: (results: typeof restaurants) => void }) => {
    const [selectedCuisine, setSelectedCuisine] = useState("");
    const [selectedPrice, setSelectedPrice] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple recommendation logic
        const results = restaurants.filter(
            r =>
                (!selectedCuisine || r.cuisine === selectedCuisine) &&
                (!selectedPrice || r.price === selectedPrice)
        );
        onRecommend(results);
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow w-full max-w-md mx-auto mb-6">
            <h2 className="text-lg font-bold mb-2">Your Taste Profile</h2>
            <label className="block mb-2">
                Preferred Cuisine:
                <select value={selectedCuisine} onChange={e => setSelectedCuisine(e.target.value)} className="ml-2">
                    <option value="">Any</option>
                    {cuisines.map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </label>
            <label className="block mb-2">
                Price Range:
                <select value={selectedPrice} onChange={e => setSelectedPrice(e.target.value)} className="ml-2">
                    <option value="">Any</option>
                    {prices.map(p => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>
            </label>
            <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Get Recommendations</button>
        </form>
    );
};
