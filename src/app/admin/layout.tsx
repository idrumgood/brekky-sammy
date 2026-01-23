'use client';

import { useAuth } from '@/lib/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, ShieldAlert, Users, Store, MessageSquare, List, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { isAdmin, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !isAdmin) {
            router.push('/');
        }
    }, [isAdmin, loading, router]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="animate-spin text-primary" size={48} />
                <p className="text-muted-foreground animate-pulse font-medium">Verifying Administrative Access...</p>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-6 animate-in fade-in zoom-in duration-500">
                <div className="bg-destructive/10 p-6 rounded-full text-destructive shadow-inner">
                    <ShieldAlert size={64} />
                </div>
                <div className="space-y-2">
                    <h1 className="text-4xl font-black italic tracking-tighter text-breakfast-coffee">ACCESS DENIED</h1>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                        This restricted area is reserved for sandwich connoisseurs with administrative clearances.
                    </p>
                </div>
                <Link
                    href="/"
                    className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                    Return to Safety
                </Link>
            </div>
        );
    }

    const navItems = [
        { label: 'Overview', href: '/admin', icon: LayoutDashboard },
        { label: 'Users', href: '/admin/users', icon: Users },
        { label: 'Restaurants', href: '/admin/restaurants', icon: Store },
        { label: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
        { label: 'Ingredients', href: '/admin/ingredients', icon: List },
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row gap-12">
                {/* Admin Sidebar */}
                <aside className="w-full md:w-72 shrink-0">
                    <div className="glassmorphism p-6 rounded-3xl sticky top-28">
                        <div className="flex items-center gap-2 mb-8 px-2">
                            <div className="bg-primary p-1.5 rounded-lg text-primary-foreground">
                                <ShieldAlert size={20} />
                            </div>
                            <h2 className="text-lg font-bold tracking-tight">Admin Panel</h2>
                        </div>

                        <nav className="space-y-1.5">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium ${isActive
                                                ? 'bg-primary text-primary-foreground shadow-md scale-[1.02]'
                                                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                            }`}
                                    >
                                        <Icon size={18} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="mt-12 pt-6 border-t border-border/50 text-center">
                            <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground/50">BrekkySammy v1.0 Admin</p>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
                    {children}
                </main>
            </div>
        </div>
    );
}
