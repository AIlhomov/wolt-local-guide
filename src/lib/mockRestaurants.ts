import sushiImage from "@/assets/sushi.jpg";
import pizzaImage from "@/assets/pizza.jpg";
import thaiImage from "@/assets/thai.jpg";
import burgerImage from "@/assets/burger.jpg";
import dessertImage from "@/assets/dessert.jpg";

// Mock restaurant data for recommendations
export const restaurants = [
    {
        id: 1,
        name: "Sushi Helsinki",
        cuisine: "Japanese",
        price: "$$$",
        image: sushiImage,
        rating: 4.8,
        deliveryTime: "25-35 min",
        aiReason: "You love sushi on Thursdays, and this place matches your taste profile at 95%",
        matchScore: 95,
        trending: true,
    },
    {
        id: 2,
        name: "Pizza Kallio",
        cuisine: "Italian",
        price: "$$",
        image: pizzaImage,
        rating: 4.7,
        deliveryTime: "20-30 min",
        aiReason: "Perfect comfort food for tonight's weather and your past Friday orders",
        matchScore: 92,
        trending: false,
    },
    {
        id: 3,
        name: "Thai Express",
        cuisine: "Thai",
        price: "$$",
        image: thaiImage,
        rating: 4.6,
        deliveryTime: "30-40 min",
        aiReason: "Spicy noodles for your adventurous taste!",
        matchScore: 90,
        trending: true,
    },
    {
        id: 4,
        name: "Burger Central",
        cuisine: "American",
        price: "$",
        image: burgerImage,
        rating: 4.5,
        deliveryTime: "15-25 min",
        aiReason: "Classic burgers for your comfort food cravings.",
        matchScore: 88,
        trending: false,
    },
    {
        id: 5,
        name: "Vegan Delight",
        cuisine: "Vegan",
        price: "$$",
        image: dessertImage,
        rating: 4.9,
        deliveryTime: "20-30 min",
        aiReason: "Healthy vegan options for your lifestyle.",
        matchScore: 93,
        trending: true,
    },
];
