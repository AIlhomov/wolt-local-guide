import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon issue with Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom bike icon for the driver
const bikeIcon = new L.Icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%2300D9FF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='18.5' cy='17.5' r='3.5'/%3E%3Ccircle cx='5.5' cy='17.5' r='3.5'/%3E%3Ccircle cx='15' cy='5' r='1'/%3E%3Cpath d='M12 17.5V14l-3-3 4-3 2 3h2'/%3E%3C/svg%3E",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Restaurant icon
const restaurantIcon = new L.Icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='%23FF6B35' stroke='white' stroke-width='2'%3E%3Cpath d='M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2'/%3E%3Cpath d='M7 2v20'/%3E%3Cpath d='M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7'/%3E%3C/svg%3E",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// Destination icon
const destinationIcon = new L.Icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='%234CAF50' stroke='white' stroke-width='2'%3E%3Cpath d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'/%3E%3Ccircle cx='12' cy='10' r='3' fill='white'/%3E%3C/svg%3E",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

interface AnimatedDriverProps {
  route: [number, number][];
  speed: number;
  onProgress: (progress: number) => void;
}

const AnimatedDriver = ({ route, speed, onProgress }: AnimatedDriverProps) => {
  const [position, setPosition] = useState<[number, number]>(route[0]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const map = useMap();

  useEffect(() => {
    if (currentIndex >= route.length - 1) {
      onProgress(100);
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        if (next < route.length) {
          setPosition(route[next]);
          onProgress((next / (route.length - 1)) * 100);
          
          // Center map on driver
          map.setView(route[next], map.getZoom());
          
          return next;
        }
        return prev;
      });
    }, speed);

    return () => clearInterval(timer);
  }, [currentIndex, route, speed, map, onProgress]);

  // @ts-expect-error - React Leaflet type definition issue
  return <Marker position={position} icon={bikeIcon} />;
};

interface DeliveryMapProps {
  onProgressUpdate: (progress: number) => void;
}

export const DeliveryMap = ({ onProgressUpdate }: DeliveryMapProps) => {
  // Helsinki area coordinates
  const restaurant: [number, number] = [60.1699, 24.9384]; // Helsinki center
  const destination: [number, number] = [60.1867, 24.9698]; // Kallio
  
  // Generate a realistic route (simplified version - in production would use routing API)
  const generateRoute = (start: [number, number], end: [number, number]): [number, number][] => {
    const steps = 50;
    const route: [number, number][] = [];
    
    // Add some curves to make it look more realistic
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const lat = start[0] + (end[0] - start[0]) * t + Math.sin(t * Math.PI * 3) * 0.005;
      const lng = start[1] + (end[1] - start[1]) * t + Math.cos(t * Math.PI * 2) * 0.005;
      route.push([lat, lng]);
    }
    
    return route;
  };

  const route = generateRoute(restaurant, destination);
  const center: [number, number] = [60.1783, 24.9541]; // Center between start and end

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden border-2 border-primary/20">
      <MapContainer
        // @ts-expect-error - React Leaflet type definition issue
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Route line */}
        <Polyline
          positions={route}
          pathOptions={{ color: "#00D9FF", weight: 4, opacity: 0.7, dashArray: "10, 10" }}
        />
        
        {/* @ts-expect-error - React Leaflet type definition issue */}
        <Marker position={restaurant} icon={restaurantIcon} />
        
        {/* @ts-expect-error - React Leaflet type definition issue */}
        <Marker position={destination} icon={destinationIcon} />
        
        {/* Animated driver */}
        <AnimatedDriver route={route} speed={100} onProgress={onProgressUpdate} />
      </MapContainer>
      
      {/* Map overlay with info */}
      <div className="absolute top-4 left-4 bg-background/95 backdrop-blur px-4 py-2 rounded-lg shadow-lg border border-border z-[1000]">
        <p className="text-sm font-semibold text-foreground">Live Tracking</p>
        <p className="text-xs text-muted-foreground">Helsinki, Finland</p>
      </div>
    </div>
  );
};
