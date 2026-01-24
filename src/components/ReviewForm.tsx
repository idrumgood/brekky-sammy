'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { createReview, getGlobalIngredients } from '@/lib/reviews';
import {
    Star,
    Upload,
    Check,
    ChefHat,
    ArrowRight,
    ArrowLeft,
    Camera,
    Utensils,
    Plus,
    X,
    Loader2,
    MapPin,
    MessageSquare
} from 'lucide-react';

interface Restaurant {
    id: string;
    name: string;
}

interface Sandwich {
    id: string;
    name: string;
    restaurantId: string;
}

export default function ReviewForm() {
    const { user } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form State
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [sandwiches, setSandwiches] = useState<Sandwich[]>([]);
    const [globalIngredients, setGlobalIngredients] = useState<string[]>([]);

    const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
    const [newRestaurantName, setNewRestaurantName] = useState('');
    const [newRestaurantWebsite, setNewRestaurantWebsite] = useState(''); // Added
    const [selectedSandwichId, setSelectedSandwichId] = useState('');
    const [newSandwichName, setNewSandwichName] = useState('');

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
    const [newIngredient, setNewIngredient] = useState('');
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1); // Added
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const rSnap = await getDocs(query(collection(db, 'restaurants'), orderBy('name')));
            setRestaurants(rSnap.docs.map(doc => ({ id: doc.id, name: doc.data().name })));

            const iList = await getGlobalIngredients();
            setGlobalIngredients(iList);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedRestaurantId && selectedRestaurantId !== 'new') {
            const fetchSandwiches = async () => {
                const sSnap = await getDocs(query(collection(db, 'sandwiches'), orderBy('name')));
                setSandwiches(sSnap.docs
                    .map(doc => ({ id: doc.id, ...doc.data() } as Sandwich))
                    .filter(s => s.restaurantId === selectedRestaurantId)
                );
            };
            fetchSandwiches();
        } else {
            setSandwiches([]);
            setSelectedSandwichId('');
        }
    }, [selectedRestaurantId]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const addIngredient = (ing: string) => {
        const cleanIng = ing.toLowerCase().trim();
        if (cleanIng && !selectedIngredients.includes(cleanIng)) {
            setSelectedIngredients([...selectedIngredients, cleanIng]);
        }
        setNewIngredient('');
    };

    const removeIngredient = (ing: string) => {
        setSelectedIngredients(selectedIngredients.filter(i => i !== ing));
    };

    const handleSubmit = async () => {
        if (!user) return;
        setLoading(true);
        try {
            await createReview({
                userId: user.uid,
                userName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
                rating,
                comment,
                sandwichId: selectedSandwichId,
                restaurantId: selectedRestaurantId,
                ingredients: selectedIngredients,
                imageFile: imageFile || undefined,
                newRestaurantName: selectedRestaurantId === 'new' ? newRestaurantName : undefined,
                newRestaurantWebsite: selectedRestaurantId === 'new' ? newRestaurantWebsite : undefined, // Added
                newSandwichName: selectedSandwichId === 'new' ? newSandwichName : undefined,
            });
            router.push('/profile');
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-border">
            {/* Progress Bar */}
            <div className="h-2 w-full bg-secondary">
                <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${(step / 4) * 100}%` }}
                />
            </div>

            <div className="p-8 md:p-12">
                {step === 1 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div>
                            <h2 className="text-3xl font-black text-breakfast-coffee mb-2">Where'd you eat?</h2>
                            <p className="text-muted-foreground">Select a restaurant or add a new hidden gem.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <MapPin size={16} className="text-primary" />
                                    Restaurant
                                </label>
                                <select
                                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                    value={selectedRestaurantId}
                                    onChange={(e) => setSelectedRestaurantId(e.target.value)}
                                >
                                    <option value="">Select a spot...</option>
                                    {restaurants.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                    <option value="new">+ Add New Restaurant</option>
                                </select>

                                {selectedRestaurantId === 'new' && (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                        <input
                                            type="text"
                                            placeholder="Restaurant Name"
                                            className="w-full bg-secondary border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-breakfast-coffee placeholder:text-muted-foreground/50"
                                            value={newRestaurantName}
                                            onChange={(e) => setNewRestaurantName(e.target.value)}
                                        />
                                        <input
                                            type="url"
                                            placeholder="Website URL (Optional)"
                                            className="w-full bg-secondary border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-breakfast-coffee placeholder:text-muted-foreground/50"
                                            value={newRestaurantWebsite}
                                            onChange={(e) => setNewRestaurantWebsite(e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>

                            {selectedRestaurantId && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                        <Utensils size={16} className="text-primary" />
                                        Sandwich
                                    </label>
                                    <select
                                        className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                        value={selectedSandwichId}
                                        onChange={(e) => setSelectedSandwichId(e.target.value)}
                                    >
                                        <option value="">What sandwich did you have?</option>
                                        {sandwiches.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        <option value="new">+ Add New Sandwich</option>
                                    </select>

                                    {selectedSandwichId === 'new' && (
                                        <input
                                            type="text"
                                            placeholder="Sandwich Name (e.g. 'The Classic B.E.C')"
                                            className="w-full bg-secondary border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-breakfast-coffee placeholder:text-muted-foreground/50"
                                            value={newSandwichName}
                                            onChange={(e) => setNewSandwichName(e.target.value)}
                                        />
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            disabled={!selectedRestaurantId || !selectedSandwichId || (selectedRestaurantId === 'new' && !newRestaurantName) || (selectedSandwichId === 'new' && !newSandwichName)}
                            onClick={() => setStep(2)}
                            className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                        >
                            Next Step
                            <ArrowRight size={20} />
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div>
                            <h2 className="text-3xl font-black text-breakfast-coffee mb-2">The Good Stuff</h2>
                            <p className="text-muted-foreground">Rating and ingredients logic here.</p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex flex-col items-center gap-4">
                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Overall Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            key={s}
                                            onMouseEnter={() => setHoverRating(s)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => setRating(s)}
                                            className="transition-transform active:scale-95 hover:scale-110"
                                        >
                                            <Star
                                                size={40}
                                                className={`transition-colors ${(hoverRating || rating) >= s ? 'fill-breakfast-egg text-breakfast-egg' : 'text-gray-200'}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <span className="text-lg font-bold text-breakfast-coffee italic">
                                    {rating === 5 ? 'Legendary' : rating === 4 ? 'Great' : rating === 3 ? 'Solid' : rating === 2 ? 'Meh' : rating === 1 ? 'Never Again' : 'Pick a star'}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <ChefHat size={16} className="text-primary" />
                                    What's inside?
                                </label>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {selectedIngredients.map(ing => (
                                        <span key={ing} className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 group">
                                            {ing}
                                            <button onClick={() => removeIngredient(ing)} className="hover:text-red-500 transition-colors">
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <div className="relative">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Add ingredient (e.g. Latke, Miso Mayo)"
                                            className="flex-1 bg-secondary border border-border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-breakfast-coffee placeholder:text-muted-foreground/50"
                                            value={newIngredient}
                                            onChange={(e) => {
                                                setNewIngredient(e.target.value);
                                                setActiveSuggestionIndex(-1);
                                            }}
                                            onKeyDown={(e) => {
                                                const suggestions = globalIngredients.filter(i =>
                                                    i.toLowerCase().includes(newIngredient.toLowerCase()) &&
                                                    !selectedIngredients.includes(i)
                                                ).slice(0, 5);

                                                if (e.key === 'ArrowDown') {
                                                    setActiveSuggestionIndex(prev => Math.min(prev + 1, suggestions.length - 1));
                                                } else if (e.key === 'ArrowUp') {
                                                    setActiveSuggestionIndex(prev => Math.max(prev - 1, -1));
                                                } else if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    if (activeSuggestionIndex >= 0) {
                                                        addIngredient(suggestions[activeSuggestionIndex]);
                                                    } else {
                                                        addIngredient(newIngredient);
                                                    }
                                                }
                                            }}
                                        />
                                        <button
                                            onClick={() => addIngredient(newIngredient)}
                                            className="bg-secondary p-2 rounded-xl text-primary hover:bg-secondary/80 transition-colors"
                                        >
                                            <Plus size={24} />
                                        </button>
                                    </div>

                                    {/* Type-ahead Dropdown */}
                                    {newIngredient.length > 0 && (
                                        <div className="absolute z-50 w-full mt-1 bg-white border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1">
                                            {globalIngredients
                                                .filter(i => i.toLowerCase().includes(newIngredient.toLowerCase()) && !selectedIngredients.includes(i))
                                                .slice(0, 5)
                                                .map((ing, idx) => (
                                                    <button
                                                        key={ing}
                                                        onClick={() => addIngredient(ing)}
                                                        className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${idx === activeSuggestionIndex ? 'bg-primary text-white' : 'hover:bg-secondary text-breakfast-coffee'}`}
                                                    >
                                                        {ing}
                                                    </button>
                                                ))
                                            }
                                        </div>
                                    )}
                                </div>

                                {/* Quick Suggestions */}
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    <span className="text-xs text-muted-foreground uppercase font-black mr-2 self-center">Quick Add:</span>
                                    {globalIngredients
                                        .filter(i => !selectedIngredients.includes(i))
                                        .slice(0, 8)
                                        .map(ing => (
                                            <button
                                                key={ing}
                                                onClick={() => addIngredient(ing)}
                                                className="text-xs bg-secondary hover:bg-breakfast-gold/20 border border-border rounded-lg px-2.5 py-1.5 text-breakfast-coffee font-bold transition-all"
                                            >
                                                {ing}
                                            </button>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setStep(1)} className="flex-1 bg-secondary text-breakfast-coffee py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-secondary/80 transition-all">
                                <ArrowLeft size={20} />
                                Back
                            </button>
                            <button
                                disabled={rating === 0}
                                onClick={() => setStep(3)}
                                className="flex-[2] bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                            >
                                Next Step
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div>
                            <h2 className="text-3xl font-black text-breakfast-coffee mb-2">Show us the Goods</h2>
                            <p className="text-muted-foreground">Upload a photo for the club to salivate over.</p>
                        </div>

                        <div className="space-y-6">
                            <div
                                className={`relative aspect-video rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden bg-secondary/20 ${imagePreview ? 'border-primary' : 'border-border'}`}
                            >
                                {imagePreview ? (
                                    <>
                                        <img src={imagePreview} className="w-full h-full object-cover" />
                                        <button onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors">
                                            <X size={20} />
                                        </button>
                                    </>
                                ) : (
                                    <div className="text-center p-8">
                                        <div className="bg-white p-4 rounded-2xl shadow-sm inline-block mb-4 text-primary">
                                            <Camera size={40} />
                                        </div>
                                        <p className="font-bold text-breakfast-coffee mb-2 text-lg">Snap a photo / Choose file</p>
                                        <p className="text-sm text-muted-foreground">Mobile users can access camera directly.</p>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <MessageSquare size={16} className="text-primary" />
                                    Add a Comment
                                </label>
                                <textarea
                                    placeholder="Tell us everything. The bun, the bite, the vibes..."
                                    className="w-full bg-secondary/50 border border-border rounded-2xl px-4 py-4 min-h-[120px] outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-lg leading-relaxed"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setStep(2)} className="flex-1 bg-secondary text-breakfast-coffee py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-secondary/80 transition-all">
                                <ArrowLeft size={20} />
                                Back
                            </button>
                            <button
                                onClick={() => setStep(4)}
                                className="flex-[2] bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                Review Summary
                                <Check size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div>
                            <h2 className="text-3xl font-black text-breakfast-coffee mb-2">Look Good?</h2>
                            <p className="text-muted-foreground">One final check before we post to the club.</p>
                        </div>

                        <div className="bg-secondary/30 rounded-3xl p-6 border border-border space-y-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-breakfast-coffee">
                                        {selectedSandwichId === 'new' ? newSandwichName : sandwiches.find(s => s.id === selectedSandwichId)?.name}
                                    </h3>
                                    <p className="text-primary font-bold">
                                        @ {selectedRestaurantId === 'new' ? newRestaurantName : restaurants.find(r => r.id === selectedRestaurantId)?.name}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 bg-breakfast-egg text-breakfast-coffee px-3 py-1 rounded-full font-black">
                                    <Star size={16} className="fill-breakfast-coffee" />
                                    {rating}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {selectedIngredients.map(ing => (
                                    <span key={ing} className="text-xs bg-white px-2 py-1 rounded-lg border border-border font-bold text-muted-foreground">
                                        {ing}
                                    </span>
                                ))}
                            </div>

                            {comment && (
                                <p className="text-breakfast-coffee italic leading-relaxed border-l-4 border-primary/20 pl-4 py-1">
                                    "{comment}"
                                </p>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setStep(3)} className="flex-1 bg-secondary text-breakfast-coffee py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-secondary/80 transition-all">
                                <ArrowLeft size={20} />
                                Back
                            </button>
                            <button
                                disabled={loading}
                                onClick={handleSubmit}
                                className="flex-[2] bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {loading ? <Loader2 className="animate-spin" size={24} /> : 'Post Review'}
                                {!loading && <Check size={20} />}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
