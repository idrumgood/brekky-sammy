'use client';

import { useState } from 'react';
import { Settings, X, Loader2, Globe, MapPin, Building2 } from 'lucide-react';
import { updateRestaurant } from '@/lib/restaurants';
import { useRouter } from 'next/navigation';

interface Restaurant {
    id: string;
    name: string;
    location?: string;
    website?: string;
}

export default function EditRestaurantModal({ restaurant }: { restaurant: Restaurant }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(restaurant.name);
    const [website, setWebsite] = useState(restaurant.website || '');
    const [location, setLocation] = useState(restaurant.location || '');
    const router = useRouter();

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateRestaurant(restaurant.id, {
                name,
                website: website || undefined,
                location: location || undefined
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

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white/50 hover:text-white"
                title="Edit Restaurant Info"
            >
                <Settings size={18} />
            </button>
        );
    }

    return (
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

                <div className="p-8 space-y-6">
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
                                Location
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
}
