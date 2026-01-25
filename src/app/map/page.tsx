/* eslint-disable @typescript-eslint/no-explicit-any */
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Map as MapIcon, Compass, Info } from 'lucide-react';
import MapView from '@/components/MapView';

export const dynamic = "force-dynamic";

const sanitize = (obj: any) => {
    if (!obj) return null;
    const newObj = { ...obj };
    for (const [key, value] of Object.entries(newObj)) {
        if (value && typeof value === 'object' && 'toDate' in (value as any)) {
            newObj[key] = (value as any).toDate().toISOString();
        } else if (value && typeof value === 'object' && '_seconds' in (value as any)) {
            newObj[key] = new Date((value as any)._seconds * 1000).toISOString();
        }
    }
    return newObj;
};

async function getRestaurants() {
    const snap = await getDocs(query(collection(db, 'restaurants'), orderBy('name')));
    return snap.docs.map(doc => sanitize({ id: doc.id, ...doc.data() })) as any[];
}

export default async function MapPage() {
    const restaurants = await getRestaurants();

    return (
        <div className="space-y-6 flex flex-col h-full">
            <div className="space-y-2">
                <div className="flex items-center gap-3 text-primary mb-2">
                    <div className="p-2 bg-primary/10 rounded-xl">
                        <MapIcon size={24} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.3em]">Geographic Survey</span>
                </div>
                <h1 className="text-5xl font-black text-breakfast-coffee italic tracking-tighter">SURVEYING THE SCENE</h1>
                <p className="text-muted-foreground text-lg italic max-w-xl leading-relaxed">
                    A tactical overview of the city&apos;s most critical breakfast supply points.
                </p>
            </div>

            <div className="flex-1 w-full min-h-[600px] relative">
                <MapView restaurants={restaurants} />
            </div>
        </div>
    );
}
