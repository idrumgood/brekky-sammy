import { MapPin, Utensils, ArrowRight } from 'lucide-react';
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
    selectedSandwichId,
    setSelectedSandwichId,
    newSandwichName,
    setNewSandwichName,
    onNext
}: RestaurantStepProps) {
    const isNextDisabled = !selectedRestaurantId || !selectedSandwichId || (selectedRestaurantId === 'new' && !newRestaurantName) || (selectedSandwichId === 'new' && !newSandwichName);

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
                            <input
                                type="text"
                                placeholder="Restaurant Name"
                                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-breakfast-coffee placeholder:text-muted-foreground/50"
                                value={newRestaurantName}
                                onChange={(e) => setNewRestaurantName(e.target.value)}
                            />
                            <input
                                type="url"
                                placeholder="Website URL (Optional)"
                                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-breakfast-coffee placeholder:text-muted-foreground/50"
                                value={newRestaurantWebsite}
                                onChange={(e) => setNewRestaurantWebsite(e.target.value)}
                            />
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
