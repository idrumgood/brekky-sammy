'use client';

import React from 'react';
import { Badge as BadgeType, ALL_BADGES } from '@/lib/badges';
import Image from 'next/image';

interface BadgeIconProps {
    slug: string;
    size?: 'sm' | 'md' | 'lg';
    showDescription?: boolean;
    grayscale?: boolean;
}

export default function BadgeIcon({ slug, size = 'md', showDescription = false, grayscale = false }: BadgeIconProps) {
    const badge = ALL_BADGES.find(b => b.slug === slug);

    if (!badge) return null;

    const sizeClasses = {
        sm: 'w-10 h-10',
        md: 'w-16 h-16',
        lg: 'w-24 h-24'
    };

    return (
        <div className="flex flex-col items-center gap-2 group relative">
            <div className={`
                ${sizeClasses[size]} 
                relative flex items-center justify-center transition-transform hover:scale-110
            `}>
                <div className={`
                    w-full h-full rounded-full p-2 bg-white/10 border border-white/20 shadow-lg
                    flex items-center justify-center
                    ${grayscale ? 'grayscale opacity-40' : 'hover:shadow-breakfast-egg/20'}
                `}>
                    <img
                        src={badge.iconPath}
                        alt={badge.name}
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-breakfast-coffee text-white text-xs rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 min-w-40 text-center border border-white/10 backdrop-blur-md">
                    <p className="font-bold text-breakfast-egg mb-1">{badge.name}</p>
                    <p className="text-white/70">{badge.description}</p>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-breakfast-coffee" />
                </div>
            </div>

            {showDescription && (
                <div className="text-center">
                    <p className={`text-xs font-bold ${grayscale ? 'text-muted-foreground' : 'text-breakfast-coffee'}`}>{badge.name}</p>
                </div>
            )}
        </div>
    );
}
