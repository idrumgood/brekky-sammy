import Link from 'next/link';
import { Star, MapPin } from 'lucide-react';

export interface SandwichCardProps {
    id: string;
    name: string;
    restaurantName: string;
    averageRating: number;
    reviewCount: number;
    imageUrl?: string;
    ingredients?: string[];
}

export default function SandwichCard({
    id,
    name,
    restaurantName,
    averageRating,
    reviewCount,
    imageUrl,
    ingredients = []
}: SandwichCardProps) {
    return (
        <Link href={`/sandwich/${id}`} className="group">
            <div className="bg-card rounded-3xl p-4 transition-all hover:shadow-xl border-2 border-transparent hover:border-primary/20 overflow-hidden h-full flex flex-col">
                <div className="relative aspect-square w-full rounded-2xl bg-secondary mb-4 overflow-hidden">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary/20 bg-breakfast-egg">
                            <Star size={48} fill="currentColor" />
                        </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                        <Star size={14} className="text-primary fill-primary" />
                        <span className="text-xs font-bold text-breakfast-coffee">{averageRating.toFixed(1)}</span>
                    </div>
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-1 text-primary text-[10px] font-bold uppercase tracking-wider mb-1">
                        <MapPin size={10} />
                        {restaurantName}
                    </div>
                    <h3 className="text-lg font-bold text-breakfast-coffee leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-2">
                        {name}
                    </h3>

                    <div className="flex flex-wrap gap-1 mb-4">
                        {ingredients.slice(0, 3).map(ing => (
                            <span key={ing} className="px-2 py-0.5 bg-secondary/50 text-secondary-foreground text-[10px] font-medium rounded-full">
                                {ing}
                            </span>
                        ))}
                        {ingredients.length > 3 && (
                            <span className="text-[10px] text-muted-foreground font-medium pl-1">
                                +{ingredients.length - 3} more
                            </span>
                        )}
                    </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                        {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        <Star size={14} />
                    </div>
                </div>
            </div>
        </Link>
    );
}
