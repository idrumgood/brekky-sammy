import { Coffee, Globe, Github, Mail } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col items-center text-center mb-16">
                <div className="bg-primary p-4 rounded-[2rem] text-primary-foreground mb-8 shadow-2xl rotate-3">
                    <Coffee size={48} strokeWidth={2.5} />
                </div>
                <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter text-breakfast-coffee mb-6">
                    ABOUT THE <span className="text-primary underline decoration-breakfast-coffee/10 underline-offset-8">PROJECT</span>
                </h1>
                <p className="text-xl text-muted-foreground font-medium leading-relaxed italic max-w-2xl">
                    "Searching for the perfect breakfast sandwich isn't just a hobby; it's a mission."
                </p>
            </div>

            <div className="glassmorphism p-10 md:p-16 rounded-[3rem] border border-white/20 shadow-2xl space-y-12">
                <section className="space-y-6">
                    <h2 className="text-2xl font-black tracking-tight text-breakfast-coffee uppercase">The Creator</h2>
                    <div className="flex flex-col md:flex-row gap-8 items-center bg-secondary/30 p-8 rounded-3xl border border-border/50">
                        <img
                            src="https://i1.sndcdn.com/avatars-0eaY35AYs2cs3wgT-b4z52A-t500x500.jpg"
                            alt="Bryan Dunk"
                            className="w-32 h-32 rounded-[2rem] border-4 border-white shadow-xl shadow-primary/10"
                        />
                        <div className="flex-1 space-y-4 text-center md:text-left">
                            <h3 className="text-xl font-bold text-breakfast-coffee">Bryan Dunk</h3>
                            <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                                Software engineer, breakfast enthusiast, and the hands behind BrekkySammy. Built with a lot of AI help (so blame it for the cheesiness).
                            </p>
                            <div className="flex items-center justify-center md:justify-start gap-4">
                                <a href="https://idrumgood.com" target="_blank" className="p-2 bg-white rounded-xl shadow-sm hover:scale-110 transition-transform text-primary"><Globe size={18} /></a>
                                <a href="https://github.com/idrumgood" target="_blank" className="p-2 bg-white rounded-xl shadow-sm hover:scale-110 transition-transform text-breakfast-coffee"><Github size={18} /></a>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-black tracking-tight text-breakfast-coffee uppercase">The Vision</h2>
                    <div className="prose prose-stone">
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            BrekkySammy was born from the need to organize and share the best breakfast spots in the city.
                            What started as a shared list between friends evolved into a dedicated platform for
                            the breakfast sandwich community.
                        </p>
                        <p className="text-muted-foreground font-medium leading-relaxed mt-4">
                            We believe in the power of the perfect layering, the importance of a properly toasted bun,
                            and the magic of the first bite.
                        </p>
                    </div>
                </section>

                <div className="pt-8 border-t border-border/10 flex flex-col items-center gap-6">
                    <Link href="/submit" className="bg-primary text-primary-foreground px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20">
                        Contribute a Review
                    </Link>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">Established 2026</p>
                </div>
            </div>
        </div>
    );
}
