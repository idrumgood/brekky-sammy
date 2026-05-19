'use client';

import { useState, useMemo } from 'react';
import SandwichCard from './SandwichCard';
import FilterControls, { FilterState } from './FilterControls';
import SortControls, { SortOption } from './SortControls';
import { filterAndSortSandwiches } from '@/lib/filter-utils';
import { Sandwich } from '@/lib/sandwiches';
import { Search as SearchIcon } from 'lucide-react';

interface SandwichListViewProps {
    initialSandwiches: any[]; // Using any to match the serialized data from server
    initialQuery: string;
}

export default function SandwichListView({ initialSandwiches, initialQuery }: SandwichListViewProps) {
    const [filters, setFilters] = useState<FilterState>({
        categories: [],
        dietary: [],
        mustInclude: []
    });
    const [sort, setSort] = useState<SortOption>('rating');

    const filteredResults = useMemo(() => {
        return filterAndSortSandwiches(initialSandwiches as Sandwich[], filters, sort, initialQuery);
    }, [initialSandwiches, filters, sort, initialQuery]);

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-80 flex-shrink-0">
                <div className="sticky top-24">
                    <FilterControls filters={filters} onChange={setFilters} />
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-breakfast-coffee mb-1">
                            {initialQuery ? `Results for "${initialQuery}"` : "All Sandwiches"}
                        </h1>
                        <p className="text-muted-foreground">
                            Found {filteredResults.length} {filteredResults.length === 1 ? 'sandwich' : 'sandwiches'} matching your criteria.
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <SortControls value={sort} onChange={setSort} />
                    </div>
                </div>

                {filteredResults.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredResults.map((sandwich) => (
                            <SandwichCard
                                key={sandwich.id}
                                id={sandwich.id}
                                name={sandwich.name}
                                restaurantName={(sandwich as any).restaurantName || 'Unknown'}
                                averageRating={sandwich.averageRating}
                                reviewCount={sandwich.reviewCount}
                                ingredients={sandwich.ingredients}
                                imageUrl={sandwich.imageUrl}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center bg-secondary/20 rounded-3xl border-2 border-dashed border-border">
                        <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-muted-foreground">
                            <SearchIcon size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-breakfast-coffee mb-2">No sandwiches found</h2>
                        <p className="text-muted-foreground max-w-xs mx-auto">
                            Try adjusting your filters or search query to find what you&apos;re looking for.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
