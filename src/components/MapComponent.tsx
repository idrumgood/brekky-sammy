'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Store, Globe, MapPin } from 'lucide-react';

// Custom icon configuration
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface Restaurant {
    id: string;
    name: string;
    location?: string;
    address?: string;
    lat?: number;
    lng?: number;
    website?: string;
}

function MapBoundsHandler({ restaurants }: { restaurants: Restaurant[] }) {
    const map = useMap();

    useEffect(() => {
        if (restaurants.length === 0) return;

        const bounds = L.latLngBounds(restaurants.map(r => [r.lat!, r.lng!] as [number, number]));

        if (restaurants.length === 1) {
            map.setView(bounds.getCenter(), 15);
        } else {
            map.fitBounds(bounds, { padding: [50, 50], animate: true });
        }
    }, [map, restaurants]);

    return null;
}

function MapResizeHandler() {
    const map = useMap();
    useEffect(() => {
        // Invalidate size once on mount and once after a short delay
        // to handle any layout shifts or animations.
        map.invalidateSize();
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 300);
        return () => clearTimeout(timer);
    }, [map]);
    return null;
}

export default function MapComponent({ restaurants }: { restaurants: Restaurant[] }) {
    // Default center to Chicago
    const defaultCenter: [number, number] = [41.8781, -87.6298];
    const zoom = 12;

    const restaurantsWithCoords = restaurants.filter(r => r.lat !== undefined && r.lng !== undefined);

    return (
        <MapContainer
            center={defaultCenter}
            zoom={zoom}
            className="w-full h-full rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden"
            style={{ height: '100%', minHeight: '70vh' }}
            scrollWheelZoom={true}
        >
            <MapResizeHandler />
            <MapBoundsHandler restaurants={restaurantsWithCoords} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            {restaurantsWithCoords.map((rest) => (
                <Marker
                    key={rest.id}
                    position={[rest.lat!, rest.lng!]}
                    icon={DefaultIcon}
                >
                    <Popup className="restaurant-popup">
                        <div className="p-2 space-y-3 min-w-[200px]">
                            <h3 className="text-lg font-black text-breakfast-coffee leading-tight">{rest.name}</h3>
                            <div className="space-y-1.5">
                                {rest.address && (
                                    <div className="flex items-start gap-2 text-xs text-muted-foreground font-medium">
                                        <MapPin size={14} className="mt-0.5 text-primary" />
                                        <span>{rest.address}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-[10px] font-bold text-breakfast-coffee/60 uppercase tracking-wider">
                                    <Store size={12} />
                                    {rest.location || 'Unknown Area'}
                                </div>
                            </div>
                            <div className="flex gap-2 pt-2 border-t border-border/50">
                                {rest.website && (
                                    <a
                                        href={rest.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-secondary hover:bg-primary hover:text-white text-[10px] font-black uppercase tracking-widest py-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5"
                                    >
                                        <Globe size={12} />
                                        Site
                                    </a>
                                )}
                                <a
                                    href={`/search?q=${encodeURIComponent(rest.name)}`}
                                    className="flex-1 bg-breakfast-coffee text-white hover:bg-breakfast-coffee/90 text-[10px] font-black uppercase tracking-widest py-2 rounded-lg transition-all text-center"
                                >
                                    Reviews
                                </a>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
