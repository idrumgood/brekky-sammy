'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Settings, X, Loader2, Globe, MapPin, Building2, Search } from 'lucide-react';
import { updateRestaurant } from '@/lib/restaurants';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

interface Restaurant {
    id: string;
    name: string;
    location?: string;
    address?: string;
    lat?: number;
    lng?: number;
    website?: string;
}

export default function EditRestaurantModal({ restaurant, className }: { restaurant: Restaurant, className?: string }) {
    const { isAdmin, loading: authLoading } = useAuth();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(restaurant.name);
    const [website, setWebsite] = useState(restaurant.website || '');
    const [location, setLocation] = useState(restaurant.location || '');
    const [address, setAddress] = useState(restaurant.address || '');
    const [lat, setLat] = useState(restaurant.lat?.toString() || '');
    const [lng, setLng] = useState(restaurant.lng?.toString() || '');
    const [geocoding, setGeocoding] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (authLoading || !isAdmin) return null;

    const handleGeocode = async () => {
        if (!address) return;
        setGeocoding(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
            const data = await response.json();
            if (data && data.length > 0) {
                setLat(data[0].lat);
                setLng(data[0].lon);
            } else {
                alert('No coordinates found for this address.');
            }
        } catch (error) {
            console.error('Geocoding error:', error);
            alert('Geocoding failed.');
        } finally {
            setGeocoding(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateRestaurant(restaurant.id, {
                name,
                website: website || undefined,
                location: location || undefined,
                address: address || undefined,
                lat: lat ? parseFloat(lat) : undefined,
                lng: lng ? parseFloat(lng) : undefined
            });
            setIsOpen(false);
            router.refresh();
        } catch (error) {
            console.error('Error updating restaurant:', error);
            alert('Failed to update restaurant.');
        } finally {
            setLoading(false);
        }
    };

    const modalContent = (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="bg-breakfast-coffee px-8 py-6 flex items-center justify-between text-white">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Building2 className="text-breakfast-egg" />
                        Edit Restaurant
                    </h3>
                    <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Building2 size={14} />
                                Restaurant Name
                            </label>
                            <input
                                type="text"
                                className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-breakfast-coffee placeholder:text-muted-foreground/50"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Globe size={14} />
                                Website URL
                            </label>
                            <input
                                type="url"
                                className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-breakfast-coffee placeholder:text-muted-foreground/50"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                placeholder="https://..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <MapPin size={14} />
                                Full Address
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="flex-1 bg-secondary/50 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-breakfast-coffee placeholder:text-muted-foreground/50"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="123 Egg St, Breakfast City"
                                />
                                <button
                                    type="button"
                                    onClick={handleGeocode}
                                    disabled={geocoding || !address}
                                    className="px-4 bg-secondary hover:bg-secondary/80 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center text-breakfast-coffee"
                                    title="Auto-fill Coordinates"
                                >
                                    {geocoding ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Latitude</label>
                                <input
                                    type="number"
                                    step="any"
                                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono text-xs text-breakfast-coffee"
                                    value={lat}
                                    onChange={(e) => setLat(e.target.value)}
                                    placeholder="e.g. 41.8781"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Longitude</label>
                                <input
                                    type="number"
                                    step="any"
                                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono text-xs text-breakfast-coffee"
                                    value={lng}
                                    onChange={(e) => setLng(e.target.value)}
                                    placeholder="e.g. -87.6298"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <MapPin size={14} />
                                Location (Display)
                            </label>
                            <input
                                type="text"
                                className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-breakfast-coffee placeholder:text-muted-foreground/50"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="City, State"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="flex-1 bg-secondary text-breakfast-coffee py-3 rounded-xl font-bold hover:bg-secondary/80 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={loading || !name}
                            onClick={handleSave}
                            className="flex-[2] bg-primary text-white py-3 rounded-xl font-black shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={className || "p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white/50 hover:text-white"}
                title="Edit Restaurant Info"
            >
                <Settings size={18} />
            </button>
            {isOpen && mounted && createPortal(modalContent, document.body)}
        </>
    );
}
