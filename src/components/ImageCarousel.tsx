'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface ImageCarouselProps {
    images: string[];
    alt: string;
}

export default function ImageCarousel({ images, alt }: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (images.length === 0) {
        return (
            <div className="relative md:aspect-video aspect-[4/5] rounded-3xl overflow-hidden bg-secondary flex items-center justify-center border border-border">
                <Image
                    src="https://images.unsplash.com/photo-1550507992-eb63ffee0847?auto=format&fit=crop&q=80&w=2070"
                    alt={alt}
                    fill
                    className="object-cover opacity-50 grayscale"
                />
                <p className="relative z-10 font-bold text-muted-foreground italic">No photos yet</p>
            </div>
        );
    }

    const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div className="relative group md:aspect-video aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border-4 border-white">
            <Image
                src={images[currentIndex]}
                alt={`${alt} - Photo ${currentIndex + 1}`}
                fill
                className="object-cover transition-all duration-500"
                priority
            />

            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

            {images.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all active:scale-95"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all active:scale-95"
                    >
                        <ChevronRight size={24} />
                    </button>

                    <div className="absolute bottom-6 right-6 flex gap-1.5">
                        {images.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 transition-all rounded-full ${i === currentIndex ? 'w-6 bg-breakfast-egg' : 'w-1.5 bg-white/50'}`}
                            />
                        ))}
                    </div>
                </>
            )}

            <div className="absolute top-6 right-6">
                <div className="bg-black/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase">
                    {currentIndex + 1} / {images.length}
                </div>
            </div>
        </div>
    );
}
