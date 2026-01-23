'use client';

import Link from 'next/link';
import { Coffee, Github, Globe } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full border-t border-border/40 bg-background mt-auto py-12 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex flex-col items-center md:items-start gap-4">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-primary/10 p-2 rounded-xl text-primary group-hover:rotate-12 transition-transform shadow-sm">
                            <Coffee size={20} strokeWidth={2.5} />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-breakfast-coffee">
                            Brekky<span className="text-primary italic">Sammy</span>
                        </span>
                    </Link>
                    <p className="text-xs text-muted-foreground font-medium">
                        © {currentYear} Bryan Dunk. All rights reserved.
                    </p>
                </div>

                <div className="flex items-center gap-12">
                    <nav className="flex items-center gap-8">
                        <Link href="/about" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                            About
                        </Link>
                        <Link href="/legal" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                            Legal
                        </Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <a
                            href="https://idrumgood.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 bg-secondary hover:bg-primary/20 rounded-xl transition-all hover:scale-110 active:scale-95 text-muted-foreground hover:text-primary"
                            title="idrumgood.com"
                        >
                            <Globe size={18} />
                        </a>
                        <a
                            href="https://github.com/idrumgood"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 bg-secondary hover:bg-primary/20 rounded-xl transition-all hover:scale-110 active:scale-95 text-muted-foreground hover:text-primary"
                            title="GitHub"
                        >
                            <Github size={18} />
                        </a>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border/10">
                <p className="text-center text-[10px] uppercase tracking-[0.3em] font-black text-muted-foreground/30">
                    Built for the love of the sandwich
                </p>
            </div>
        </footer>
    );
}
