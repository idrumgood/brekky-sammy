import { MapPin, Globe, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface RestaurantCardProps {
    id: string;
    name: string;
    location?: string;
    address?: string;
    website?: string;
}

export default function RestaurantCard({ name, location, address, website }: Omit<RestaurantCardProps, 'id'>) {
    return (
        <div className="glassmorphism p-8 rounded-[2.5rem] border border-white/10 flex flex-col justify-between group hover:shadow-2xl hover:shadow-primary/5 transition-all relative overflow-hidden h-full">
            {/* Accent Background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[5rem] -mr-8 -mt-8 group-hover:bg-primary/10 transition-colors" />

            <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-start gap-4">
                    <h3 className="text-3xl font-black text-breakfast-coffee tracking-tight leading-[1.1]">{name}</h3>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-breakfast-coffee/70 font-bold group-hover:text-primary transition-colors">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <MapPin size={18} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm">{location || 'Unknown Area'}</span>
                            {address && <span className="text-xs text-muted-foreground font-medium">{address}</span>}
                        </div>
                    </div>
                    {website && (
                        <a
                            href={website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-muted-foreground font-bold hover:text-primary transition-all pl-2"
                        >
                            <Globe size={18} />
                            <span className="text-sm underline underline-offset-4 decoration-border group-hover:decoration-primary">Official Portal</span>
                            <ArrowUpRight size={14} className="opacity-50" />
                        </a>
                    )}
                </div>
            </div>

            <div className="mt-10 pt-6 border-t border-border/20 flex justify-between items-center relative z-10">
                <Link
                    href={`/search?q=${encodeURIComponent(name)}`}
                    className="px-6 py-2.5 bg-secondary hover:bg-primary hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 shadow-sm"
                >
                    Sandwiches
                    <ArrowUpRight size={14} />
                </Link>
            </div>
        </div>
    );
}
