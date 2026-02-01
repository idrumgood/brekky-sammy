import { MapPin, Utensils, ArrowRight, Search, Loader2, Globe, Crosshair } from 'lucide-react';
import { useState } from 'react';
import { Restaurant, Sandwich } from '@/hooks/useReviewForm';

interface RestaurantStepProps {
    restaurants: Restaurant[];
    sandwiches: Sandwich[];
    selectedRestaurantId: string;
    setSelectedRestaurantId: (id: string) => void;
    newRestaurantName: string;
    setNewRestaurantName: (name: string) => void;
    newRestaurantWebsite: string;
    setNewRestaurantWebsite: (url: string) => void;
    newRestaurantAddress: string;
    setNewRestaurantAddress: (address: string) => void;
    newRestaurantLat: number | undefined;
    setNewRestaurantLat: (lat: number | undefined) => void;
    newRestaurantLng: number | undefined;
    setNewRestaurantLng: (lng: number | undefined) => void;
    selectedSandwichId: string;
    setSelectedSandwichId: (id: string) => void;
    newSandwichName: string;
    setNewSandwichName: (name: string) => void;
    onNext: () => void;
}

export function RestaurantStep({
    restaurants,
    sandwiches,
    selectedRestaurantId,
    setSelectedRestaurantId,
    newRestaurantName,
    setNewRestaurantName,
    newRestaurantWebsite,
    setNewRestaurantWebsite,
    newRestaurantAddress,
    setNewRestaurantAddress,
    newRestaurantLat,
    setNewRestaurantLat,
    newRestaurantLng,
    setNewRestaurantLng,
    selectedSandwichId,
    setSelectedSandwichId,
    newSandwichName,
    setNewSandwichName,
    onNext
}: RestaurantStepProps) {
    const [isSearching, setIsSearching] = useState(false);
    const isNextDisabled = !selectedRestaurantId || !selectedSandwichId || (selectedRestaurantId === 'new' && !newRestaurantName) || (selectedSandwichId === 'new' && !newSandwichName);

    const handleFindDetails = async () => {
        if (!newRestaurantName) return;
        setIsSearching(true);
        try {
            // Search for the restaurant in Chicago
            const query = `${newRestaurantName}, Chicago, IL`;
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&addressdetails=1`);
            const data = await response.json();

            if (data && data.length > 0) {
                const result = data[0];
                const addr = result.address;

                // Construct a condensed address: "123 Main St, Chicago, IL 60601"
                const street = [addr.house_number, addr.road].filter(Boolean).join(' ');
                const city = addr.city || addr.town || addr.village || 'Chicago';
                const state = addr.state === 'Illinois' ? 'IL' : addr.state;
                const postcode = addr.postcode || '';

                const condensedAddress = [
                    street,
                    [city, state].filter(Boolean).join(', '),
                    postcode
                ].filter(Boolean).join(' ').trim();

                setNewRestaurantAddress(condensedAddress || result.display_name);
                setNewRestaurantLat(parseFloat(result.lat));
                setNewRestaurantLng(parseFloat(result.lon));
            } else {
                alert("Couldn't find any details for this restaurant. You can still enter them manually.");
            }
        } catch (error) {
            console.error('Error finding restaurant details:', error);
            alert("An error occurred while searching. Please try manual entry.");
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
                <h2 className="text-3xl font-black text-breakfast-coffee mb-2">Where&apos;d you eat?</h2>
                <p className="text-muted-foreground">Select a restaurant or add a new hidden gem.</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-3">
                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <MapPin size={16} className="text-primary" />
                        Restaurant
                    </label>
                    <select
                        className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        value={selectedRestaurantId}
                        onChange={(e) => setSelectedRestaurantId(e.target.value)}
                    >
                        <option value="">Select a spot...</option>
                        {restaurants.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        <option value="new">+ Add New Restaurant</option>
                    </select>

                    {selectedRestaurantId === 'new' && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Restaurant Name"
                                    className="w-full bg-secondary border border-border rounded-xl px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-breakfast-coffee placeholder:text-muted-foreground/50"
                                    value={newRestaurantName}
                                    onChange={(e) => setNewRestaurantName(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={handleFindDetails}
                                    disabled={!newRestaurantName || isSearching}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-all disabled:opacity-50"
                                    title="Auto-find details"
                                >
                                    {isSearching ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                                </button>
                            </div>

                            <div className="space-y-3 p-4 bg-secondary/30 rounded-2xl border border-border/50">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <Globe size={10} />
                                        Website (Optional)
                                    </label>
                                    <input
                                        type="url"
                                        placeholder="https://..."
                                        className="w-full bg-white/50 border border-border/50 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium text-breakfast-coffee placeholder:text-muted-foreground/40"
                                        value={newRestaurantWebsite}
                                        onChange={(e) => setNewRestaurantWebsite(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <MapPin size={10} />
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="123 Sammy St, Chicago, IL"
                                        className="w-full bg-white/50 border border-border/50 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium text-breakfast-coffee placeholder:text-muted-foreground/40"
                                        value={newRestaurantAddress}
                                        onChange={(e) => setNewRestaurantAddress(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {selectedRestaurantId && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Utensils size={16} className="text-primary" />
                            Sandwich
                        </label>
                        <select
                            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            value={selectedSandwichId}
                            onChange={(e) => setSelectedSandwichId(e.target.value)}
                        >
                            <option value="">What sandwich did you have?</option>
                            {sandwiches.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            <option value="new">+ Add New Sandwich</option>
                        </select>

                        {selectedSandwichId === 'new' && (
                            <input
                                type="text"
                                placeholder="Sandwich Name (e.g. 'The Classic B.E.C')"
                                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-breakfast-coffee placeholder:text-muted-foreground/50"
                                value={newSandwichName}
                                onChange={(e) => setNewSandwichName(e.target.value)}
                            />
                        )}
                    </div>
                )}
            </div>

            <button
                disabled={isNextDisabled}
                onClick={onNext}
                className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
            >
                Next Step
                <ArrowRight size={20} />
            </button>
        </div>
    );
}
