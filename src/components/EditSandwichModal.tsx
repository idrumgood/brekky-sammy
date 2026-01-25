'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Settings, X, Loader2, Utensils, Plus, ChefHat } from 'lucide-react';
import { updateSandwich } from '@/lib/sandwiches';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { getGlobalIngredients } from '@/lib/reviews';

interface Sandwich {
    id: string;
    name: string;
    restaurantId: string;
    ingredients?: string[];
}

export default function EditSandwichModal({ sandwich, className, onSuccess }: { sandwich: Sandwich, className?: string, onSuccess?: () => void }) {
    const { isAdmin, loading: authLoading } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    const [name, setName] = useState(sandwich.name);
    const [ingredients, setIngredients] = useState<string[]>(sandwich.ingredients || []);
    const [newIngredient, setNewIngredient] = useState('');
    const [globalIngredients, setGlobalIngredients] = useState<string[]>([]);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            const fetchIngredients = async () => {
                const iList = await getGlobalIngredients();
                setGlobalIngredients(iList);
            };
            fetchIngredients();
        }
    }, [isOpen]);

    if (authLoading || !isAdmin) return null;

    const addIngredient = (ing: string) => {
        const cleanIng = ing.toLowerCase().trim();
        if (cleanIng && !ingredients.includes(cleanIng)) {
            setIngredients([...ingredients, cleanIng]);
        }
        setNewIngredient('');
        setActiveSuggestionIndex(-1);
    };

    const removeIngredient = (ing: string) => {
        setIngredients(ingredients.filter(i => i !== ing));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateSandwich(sandwich.id, {
                name,
                ingredients
            });
            setIsOpen(false);
            if (onSuccess) onSuccess();
            router.refresh();
        } catch (error) {
            console.error('Error updating sandwich:', error);
            alert('Failed to update sandwich.');
        } finally {
            setLoading(false);
        }
    };

    const modalContent = (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="bg-breakfast-coffee px-8 py-6 flex items-center justify-between text-white">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Utensils className="text-breakfast-egg" size={20} />
                        Edit Sandwich
                    </h3>
                    <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Utensils size={14} />
                                Sandwich Name
                            </label>
                            <input
                                type="text"
                                className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-breakfast-coffee placeholder:text-muted-foreground/50"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <ChefHat size={14} />
                                Ingredients
                            </label>

                            <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 bg-secondary/20 rounded-xl border border-border/50">
                                {ingredients.length > 0 ? ingredients.map(ing => (
                                    <span key={ing} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                        {ing}
                                        <button onClick={() => removeIngredient(ing)} className="hover:text-red-500 transition-colors">
                                            <X size={12} />
                                        </button>
                                    </span>
                                )) : (
                                    <span className="text-xs text-muted-foreground italic p-1">No ingredients listed yet.</span>
                                )}
                            </div>

                            <div className="relative">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Add ingredient..."
                                        className="flex-1 bg-secondary border border-border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-breakfast-coffee placeholder:text-muted-foreground/50 text-sm"
                                        value={newIngredient}
                                        onChange={(e) => {
                                            setNewIngredient(e.target.value);
                                            setActiveSuggestionIndex(-1);
                                        }}
                                        onKeyDown={(e) => {
                                            const suggestions = globalIngredients.filter(i =>
                                                i.toLowerCase().includes(newIngredient.toLowerCase()) &&
                                                !ingredients.includes(i)
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
                                        <Plus size={20} />
                                    </button>
                                </div>

                                {newIngredient.length > 0 && (
                                    <div className="absolute z-50 w-full mt-1 bg-white border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1">
                                        {globalIngredients
                                            .filter(i => i.toLowerCase().includes(newIngredient.toLowerCase()) && !ingredients.includes(i))
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
                        </div>
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="flex-1 bg-secondary text-breakfast-coffee py-3 rounded-xl font-bold hover:bg-secondary/80 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={loading || !name}
                            onClick={handleSave}
                            className="flex-[2] bg-primary text-white py-3 rounded-xl font-black shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={className || "p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white/50 hover:text-white"}
                title="Edit Sandwich Info"
            >
                <Settings size={18} />
            </button>
            {isOpen && mounted && createPortal(modalContent, document.body)}
        </>
    );
}
