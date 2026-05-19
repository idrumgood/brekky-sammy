'use client';

import { Check, X } from 'lucide-react';

export interface FilterState {
    categories: string[];
    dietary: string[];
    mustInclude: string[];
}

interface FilterControlsProps {
    filters: FilterState;
    onChange: (filters: FilterState) => void;
}

const CATEGORIES = ['Burrito', 'Sandwich', 'Bagel', 'Biscuit', 'Taco'];
const DIETARY = ['Vegetarian', 'Vegan'];
const POPULAR_MUST_HAVES = ['Bacon', 'Avocado', 'Chorizo', 'Spicy', 'Egg'];

export default function FilterControls({ filters, onChange }: FilterControlsProps) {
    const toggleCategory = (cat: string) => {
        const newCats = filters.categories.includes(cat)
            ? filters.categories.filter(c => c !== cat)
            : [...filters.categories, cat];
        onChange({ ...filters, categories: newCats });
    };

    const toggleDietary = (diet: string) => {
        const newDiet = filters.dietary.includes(diet)
            ? filters.dietary.filter(d => d !== diet)
            : [...filters.dietary, diet];
        onChange({ ...filters, dietary: newDiet });
    };

    const toggleMustInclude = (ing: string) => {
        const newInclude = filters.mustInclude.includes(ing)
            ? filters.mustInclude.filter(i => i !== ing)
            : [...filters.mustInclude, ing];
        onChange({ ...filters, mustInclude: newInclude });
    };

    const clearFilters = () => {
        onChange({ categories: [], dietary: [], mustInclude: [] });
    };

    const hasFilters = (filters.categories?.length || 0) > 0 || 
                       (filters.dietary?.length || 0) > 0 || 
                       (filters.mustInclude?.length || 0) > 0;

    return (
        <div className="bg-card border-2 border-breakfast-border rounded-3xl p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-breakfast-coffee">Filters</h3>
                {hasFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                    >
                        <X size={12} />
                        Clear all
                    </button>
                )}
            </div>

            {/* Dietary Filters */}
            <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Dietary</h4>
                <div className="flex flex-wrap gap-2">
                    {DIETARY.map(diet => (
                        <button
                            key={diet}
                            onClick={() => toggleDietary(diet)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                filters.dietary.includes(diet)
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-secondary/50 text-secondary-foreground hover:bg-secondary'
                            }`}
                        >
                            {diet}
                        </button>
                    ))}
                </div>
            </div>

            {/* Category Filters */}
            <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</h4>
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => toggleCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                filters.categories.includes(cat)
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-secondary/50 text-secondary-foreground hover:bg-secondary'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Must Include Ingredients */}
            <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Must Include</h4>
                <div className="flex flex-wrap gap-2">
                    {POPULAR_MUST_HAVES.map(ing => (
                        <button
                            key={ing}
                            onClick={() => toggleMustInclude(ing)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all flex items-center gap-1.5 ${
                                filters.mustInclude.includes(ing)
                                    ? 'bg-breakfast-egg border-primary text-breakfast-coffee'
                                    : 'bg-transparent border-breakfast-border text-muted-foreground hover:border-primary/50'
                            }`}
                        >
                            {filters.mustInclude.includes(ing) && <Check size={12} className="text-primary" />}
                            {ing}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
