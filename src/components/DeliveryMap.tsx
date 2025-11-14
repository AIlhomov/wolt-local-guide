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
          // Show whole number progress
          onProgress(Math.round((next / (route.length - 1)) * 100));

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

  // Manually selected waypoints to follow main roads in Helsinki
  const waypoints: [number, number][] = [
    restaurant,
    [60.1715, 24.9425], // Mannerheimintie
    [60.1750, 24.9450], // Near Central Railway Station
    [60.1780, 24.9500], // Kaisaniemi Park
    [60.1810, 24.9560], // Hakaniemi
    [60.1840, 24.9630], // Sörnäinen
    destination
  ];

  // Interpolate between waypoints for smooth animation
  const interpolateRoute = (points: [number, number][], stepsPerSegment = 10): [number, number][] => {
    const route: [number, number][] = [];
    for (let i = 0; i < points.length - 1; i++) {
      const start = points[i];
      const end = points[i + 1];
      for (let j = 0; j < stepsPerSegment; j++) {
        const t = j / stepsPerSegment;
        const lat = start[0] + (end[0] - start[0]) * t;
        const lng = start[1] + (end[1] - start[1]) * t;
        route.push([lat, lng]);
      }
    }
    route.push(points[points.length - 1]);
    return route;
  };

  const route = interpolateRoute(waypoints, 10);
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
        <AnimatedDriver route={route} speed={1000} onProgress={onProgressUpdate} />
      </MapContainer>

      {/* Map overlay with info */}
      <div className="absolute top-4 left-4 bg-background/95 backdrop-blur px-4 py-2 rounded-lg shadow-lg border border-border z-[1000]">
        <p className="text-sm font-semibold text-foreground">Live Tracking</p>
        <p className="text-xs text-muted-foreground">Helsinki, Finland</p>
      </div>
    </div>
  );
};
