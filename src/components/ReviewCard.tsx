'use client';

import { Star, ChevronRight, Maximize2, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export interface ReviewCardProps {
    userId?: string;
    userName?: string; // Legacy prop
    photoURL?: string;
    rating: number;
    comment: string;
    createdAt: string;
    // New flexible props
    title?: string;
    subtitle?: string;
    footer?: string;
    actionLink?: {
        href: string;
        label: string;
    };
}

export default function ReviewCard({
    userId,
    userName,
    photoURL,
    rating,
    comment,
    createdAt,
    title,
    subtitle,
    footer,
    actionLink
}: ReviewCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const date = new Date(createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    // Handle legacy vs new props
    const displayTitle = title || userName || 'Anonymous Scout';
    const displaySubtitle = subtitle || date;

    const userInfo = (
        <div className="flex items-center gap-3">
            {photoURL ? (
                <img src={photoURL} alt={displayTitle} className="w-10 h-10 rounded-full object-cover shrink-0 border border-border" />
            ) : (
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary font-bold shrink-0">
                    {displayTitle.charAt(0)}
                </div>
            )}
            <div className="min-w-0 flex-1">
                <h4 className="font-bold text-breakfast-coffee group-hover:text-primary transition-colors truncate leading-tight">
                    {displayTitle}
                </h4>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight truncate">
                    {displaySubtitle}
                </p>
            </div>
        </div>
    );

    const isLongComment = comment.length > 180;

    return (
        <>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-all group flex flex-col h-full min-h-[180px]">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="min-w-0 flex-1">
                        {userId ? (
                            <Link href={`/users/${userId}`} className="hover:opacity-80 transition-opacity block overflow-hidden">
                                {userInfo}
                            </Link>
                        ) : (
                            userInfo
                        )}
                    </div>
                    <div className="flex items-center gap-1 bg-breakfast-egg px-2 py-1 rounded-lg shrink-0">
                        <Star size={12} className="text-primary fill-primary" />
                        <span className="text-xs font-bold text-breakfast-coffee">{rating}</span>
                    </div>
                </div>

                {/* Comment Body - grows to fill space */}
                <div className="flex-1 mb-6 relative">
                    <p className="text-muted-foreground text-sm leading-relaxed italic line-clamp-4">
                        &quot;{comment}&quot;
                    </p>
                    {isLongComment && (
                        <button
                            onClick={() => setIsExpanded(true)}
                            className="mt-2 text-[10px] font-black uppercase tracking-wider text-primary hover:text-primary/80 flex items-center gap-1"
                        >
                            Read Full Review
                            <Maximize2 size={10} />
                        </button>
                    )}
                </div>

                {/* Footer / Action area */}
                <div className="flex items-center justify-between gap-4 mt-auto pt-4 border-t border-border/50">
                    {footer ? (
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest truncate">
                            {footer}
                        </p>
                    ) : (
                        <div />
                    )}

                    {actionLink && (
                        <Link
                            href={actionLink.href}
                            className="text-[10px] font-black uppercase tracking-tighter text-breakfast-coffee hover:text-primary flex items-center gap-0.5 group/link"
                        >
                            {actionLink.label}
                            <ChevronRight size={12} className="group-hover/link:translate-x-0.5 transition-transform" />
                        </Link>
                    )}
                </div>
            </div>

            {/* Expansion Modal */}
            {isExpanded && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-breakfast-coffee/60 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => setIsExpanded(false)}
                    />
                    <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 space-y-6">
                            <div className="flex items-start justify-between">
                                {userInfo}
                                <button
                                    onClick={() => setIsExpanded(false)}
                                    className="p-2 bg-secondary rounded-full text-muted-foreground hover:text-breakfast-coffee transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <Star
                                                key={s}
                                                size={16}
                                                className={s <= rating ? 'fill-breakfast-egg text-breakfast-egg' : 'text-gray-200'}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm font-bold text-breakfast-coffee">
                                        {rating}/5
                                    </span>
                                </div>

                                <p className="text-breakfast-coffee text-lg leading-relaxed italic">
                                    &quot;{comment}&quot;
                                </p>
                            </div>

                            {actionLink && (
                                <Link
                                    href={actionLink.href}
                                    onClick={() => setIsExpanded(false)}
                                    className="w-full bg-primary text-white py-4 rounded-2xl font-black text-center block shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    View {actionLink.label}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
