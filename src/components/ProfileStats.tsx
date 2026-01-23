'use client';

import { Star, MessageSquare, Award, TrendingUp } from 'lucide-react';

interface StatsProps {
    totalReviews: number;
    averageRating: number;
}

export default function ProfileStats({ totalReviews, averageRating }: StatsProps) {
    const stats = [
        {
            label: 'Total Reviews',
            value: totalReviews,
            icon: MessageSquare,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
        },
        {
            label: 'Avg. Rating',
            value: averageRating.toFixed(1),
            icon: Star,
            color: 'text-breakfast-egg',
            bgColor: 'bg-breakfast-egg/10',
        },
        {
            label: 'Club Rank',
            value: totalReviews > 10 ? 'Elite' : totalReviews > 5 ? 'regular' : 'Newbie',
            icon: Award,
            color: 'text-primary',
            bgColor: 'bg-primary/10',
        },
        {
            label: 'Impact Score',
            value: (totalReviews * averageRating).toFixed(0),
            icon: TrendingUp,
            color: 'text-green-500',
            bgColor: 'bg-green-500/10',
        }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
                <div key={stat.label} className="bg-white/50 border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`${stat.bgColor} ${stat.color} p-2 rounded-xl`}>
                            <stat.icon size={20} />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                    </div>
                    <div className="text-3xl font-extrabold text-breakfast-coffee">
                        {stat.value}
                    </div>
                </div>
            ))}
        </div>
    );
}
