'use client';

import { Star, Flame, Clock } from 'lucide-react';

export type SortOption = 'rating' | 'popularity' | 'recency';

interface SortControlsProps {
    value: SortOption;
    onChange: (value: SortOption) => void;
}

const OPTIONS: { label: string; value: SortOption; icon: any }[] = [
    { label: 'Highest Rated', value: 'rating', icon: Star },
    { label: 'Most Popular', value: 'popularity', icon: Flame },
    { label: 'Recently Added', value: 'recency', icon: Clock },
];

export default function SortControls({ value, onChange }: SortControlsProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Sort By</span>
            <div className="flex flex-wrap bg-card border-2 border-breakfast-border rounded-3xl p-1 shadow-sm w-fit">
                {OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const isActive = value === opt.value;
                    return (
                        <button
                            key={opt.value}
                            onClick={() => onChange(opt.value)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold transition-all ${
                                isActive
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-muted-foreground hover:bg-secondary/50 hover:text-secondary-foreground'
                            }`}
                        >
                            <Icon size={14} fill={isActive ? 'currentColor' : 'none'} />
                            <span className="whitespace-nowrap">{opt.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
