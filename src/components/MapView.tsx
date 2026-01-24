'use client';

import dynamic from 'next/dynamic';
import { Compass } from 'lucide-react';

// Dynamically import MapComponent to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full rounded-[2.5rem] bg-secondary/30 animate-pulse flex flex-col items-center justify-center gap-6 border border-dashed border-border/50">
            <div className="bg-white/50 p-6 rounded-full">
                <Compass className="text-muted-foreground animate-spin" size={48} />
            </div>
            <p className="text-muted-foreground font-black italic tracking-[0.3em] uppercase">Unrolling the Blueprints...</p>
        </div>
    )
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

export default function MapView({ restaurants }: { restaurants: any[] }) {
    return (
        <div className="w-full flex-1 h-full min-h-[70vh]">
            <MapComponent restaurants={restaurants} />
        </div>
    );
}
