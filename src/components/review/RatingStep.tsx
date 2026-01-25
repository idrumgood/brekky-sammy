import { Star, ChefHat, Plus, X, Lock, ArrowLeft, ArrowRight } from 'lucide-react';
import { getRatingLabel } from '@/lib/utils';

interface RatingStepProps {
    rating: number;
    setRating: (rating: number) => void;
    hoverRating: number;
    setHoverRating: (rating: number) => void;
    selectedIngredients: string[];
    originalIngredients: string[];
    globalIngredients: string[];
    newIngredient: string;
    setNewIngredient: (ing: string) => void;
    activeSuggestionIndex: number;
    setActiveSuggestionIndex: React.Dispatch<React.SetStateAction<number>>;
    addIngredient: (ing: string) => void;
    removeIngredient: (ing: string) => void;
    onBack: () => void;
    onNext: () => void;
}

export function RatingStep({
    rating,
    setRating,
    hoverRating,
    setHoverRating,
    selectedIngredients,
    originalIngredients,
    globalIngredients,
    newIngredient,
    setNewIngredient,
    activeSuggestionIndex,
    setActiveSuggestionIndex,
    addIngredient,
    removeIngredient,
    onBack,
    onNext
}: RatingStepProps) {
    const suggestions = globalIngredients.filter(i =>
        i.toLowerCase().includes(newIngredient.toLowerCase()) &&
        !selectedIngredients.includes(i)
    ).slice(0, 5);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
                <h2 className="text-3xl font-black text-breakfast-coffee mb-2">The Good Stuff</h2>
                <p className="text-muted-foreground">Rate your experience and what was inside.</p>
            </div>

            <div className="space-y-8">
                <div className="flex flex-col items-center gap-4">
                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Overall Rating</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <button
                                key={s}
                                onMouseEnter={() => setHoverRating(s)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(s)}
                                className="transition-transform active:scale-95 hover:scale-110"
                            >
                                <Star
                                    size={40}
                                    className={`transition-colors ${(hoverRating || rating) >= s ? 'fill-breakfast-egg text-breakfast-egg' : 'text-gray-200'}`}
                                />
                            </button>
                        ))}
                    </div>
                    <span className="text-lg font-bold text-breakfast-coffee italic">
                        {getRatingLabel(rating)}
                    </span>
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <ChefHat size={16} className="text-primary" />
                        What&apos;s inside?
                    </label>
                    <div className="flex flex-wrap gap-2 mb-4 max-h-[140px] overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-gray-200">
                        {selectedIngredients.map(ing => {
                            const isOriginal = originalIngredients.includes(ing);
                            return (
                                <span key={ing} className={`px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 group transition-colors ${isOriginal ? 'bg-secondary text-muted-foreground' : 'bg-primary/10 text-primary'}`}>
                                    {ing}
                                    {isOriginal ? (
                                        <div className="relative group/tooltip">
                                            <Lock size={12} className="text-muted-foreground/50" />
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-breakfast-coffee text-white text-[10px] rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50 text-center font-medium shadow-xl">
                                                This ingredient is a core part of this Sammy and cannot be removed by members.
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-breakfast-coffee" />
                                            </div>
                                        </div>
                                    ) : (
                                        <button onClick={() => removeIngredient(ing)} className="hover:text-red-500 transition-colors">
                                            <X size={14} />
                                        </button>
                                    )}
                                </span>
                            );
                        })}
                    </div>
                    <div className="relative">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Add ingredient (e.g. Latke, Miso Mayo)"
                                className="flex-1 bg-secondary border border-border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-breakfast-coffee placeholder:text-muted-foreground/50"
                                value={newIngredient}
                                onChange={(e) => {
                                    setNewIngredient(e.target.value);
                                    setActiveSuggestionIndex(-1);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'ArrowDown') {
                                        setActiveSuggestionIndex(prev => Math.min(prev + 1, suggestions.length - 1));
                                    } else if (e.key === 'ArrowUp') {
                                        setActiveSuggestionIndex(prev => Math.max(prev - 1, -1));
                                    } else if (e.key === 'Enter') {
                                        e.preventDefault();
                                        if (activeSuggestionIndex >= 0) {
                                            addIngredient(suggestions[activeSuggestionIndex]);
                                        } else if (newIngredient.trim()) {
                                            addIngredient(newIngredient);
                                        }
                                    }
                                }}
                            />
                            <button
                                onClick={() => addIngredient(newIngredient)}
                                className="bg-secondary p-2 rounded-xl text-primary hover:bg-secondary/80 transition-colors"
                            >
                                <Plus size={24} />
                            </button>
                        </div>
                        {newIngredient.length > 0 && suggestions.length > 0 && (
                            <div className="absolute z-[100] w-full mt-1 bg-white border border-border rounded-xl shadow-2xl overflow-hidden max-h-[160px] overflow-y-auto">
                                {suggestions.map((ing, idx) => (
                                    <button
                                        key={ing}
                                        onClick={() => addIngredient(ing)}
                                        className={`w-full text-left px-4 py-3 text-sm font-bold transition-colors border-b border-border last:border-0 ${idx === activeSuggestionIndex ? 'bg-primary text-white' : 'hover:bg-secondary text-breakfast-coffee'}`}
                                    >
                                        {ing}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Add Suggestions (Pills) */}
                    {globalIngredients.length > 0 && (
                        <div className="animate-in fade-in duration-500">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-3 ml-1">Popular Suggestions</p>
                            <div className="flex flex-wrap gap-2">
                                {globalIngredients
                                    .filter(ing => !selectedIngredients.includes(ing.toLowerCase()))
                                    .slice(0, 12)
                                    .map(ing => (
                                        <button
                                            key={ing}
                                            onClick={() => addIngredient(ing)}
                                            className="px-4 py-1.5 bg-white border border-border hover:border-primary/30 hover:bg-primary/5 rounded-full text-[11px] font-bold text-breakfast-coffee transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
                                        >
                                            <Plus size={10} className="text-primary" />
                                            {ing}
                                        </button>
                                    ))
                                }
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex gap-4">
                <button onClick={onBack} className="flex-1 bg-secondary text-breakfast-coffee py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-secondary/80 transition-all">
                    <ArrowLeft size={20} />
                    Back
                </button>
                <button
                    disabled={rating === 0}
                    onClick={onNext}
                    className="flex-[2] bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                >
                    Next Step
                    <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
}
