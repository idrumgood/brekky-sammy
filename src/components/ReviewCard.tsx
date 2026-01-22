import { Star } from 'lucide-react';

export interface ReviewCardProps {
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export default function ReviewCard({ userName, rating, comment, createdAt }: ReviewCardProps) {
    const date = new Date(createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary font-bold">
                        {userName.charAt(0)}
                    </div>
                    <div>
                        <h4 className="font-bold text-breakfast-coffee">{userName}</h4>
                        <p className="text-xs text-muted-foreground">{date}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 bg-breakfast-egg px-2 py-1 rounded-lg">
                    <Star size={12} className="text-primary fill-primary" />
                    <span className="text-xs font-bold text-breakfast-coffee">{rating}</span>
                </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed italic">
                "{comment}"
            </p>
        </div>
    );
}
