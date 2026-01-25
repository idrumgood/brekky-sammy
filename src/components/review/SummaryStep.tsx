import { Star, ArrowLeft, Loader2, Check } from 'lucide-react';
import { Restaurant, Sandwich } from '@/hooks/useReviewForm';

interface SummaryStepProps {
    selectedRestaurantId: string;
    newRestaurantName: string;
    restaurants: Restaurant[];
    selectedSandwichId: string;
    newSandwichName: string;
    sandwiches: Sandwich[];
    rating: number;
    selectedIngredients: string[];
    comment: string;
    loading: boolean;
    onBack: () => void;
    onSubmit: () => void;
}

export function SummaryStep({
    selectedRestaurantId,
    newRestaurantName,
    restaurants,
    selectedSandwichId,
    newSandwichName,
    sandwiches,
    rating,
    selectedIngredients,
    comment,
    loading,
    onBack,
    onSubmit
}: SummaryStepProps) {
    const restaurantName = selectedRestaurantId === 'new' ? newRestaurantName : restaurants.find(r => r.id === selectedRestaurantId)?.name;
    const sandwichName = selectedSandwichId === 'new' ? newSandwichName : sandwiches.find(s => s.id === selectedSandwichId)?.name;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
                <h2 className="text-3xl font-black text-breakfast-coffee mb-2">Look Good?</h2>
                <p className="text-muted-foreground">One final check before we post to the club.</p>
            </div>

            <div className="bg-secondary/30 rounded-3xl p-6 border border-border space-y-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-breakfast-coffee">
                            {sandwichName}
                        </h3>
                        <p className="text-primary font-bold">
                            @ {restaurantName}
                        </p>
                    </div>
                    <div className="flex items-center gap-1 bg-breakfast-egg text-breakfast-coffee px-3 py-1 rounded-full font-black">
                        <Star size={16} className="fill-breakfast-coffee" />
                        {rating}
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {selectedIngredients.map(ing => (
                        <span key={ing} className="text-xs bg-white px-2 py-1 rounded-lg border border-border font-bold text-muted-foreground">
                            {ing}
                        </span>
                    ))}
                </div>

                {comment && (
                    <p className="text-breakfast-coffee italic leading-relaxed border-l-4 border-primary/20 pl-4 py-1">
                        "{comment}"
                    </p>
                )}
            </div>

            <div className="flex gap-4">
                <button onClick={onBack} className="flex-1 bg-secondary text-breakfast-coffee py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-secondary/80 transition-all">
                    <ArrowLeft size={20} />
                    Back
                </button>
                <button
                    disabled={loading}
                    onClick={onSubmit}
                    className="flex-[2] bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    {loading ? <Loader2 className="animate-spin" size={24} /> : 'Post Review'}
                    {!loading && <Check size={20} />}
                </button>
            </div>
        </div>
    );
}
