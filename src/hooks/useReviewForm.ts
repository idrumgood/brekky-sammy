import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { createReview, getGlobalIngredients } from '@/lib/reviews';

export interface Restaurant {
    id: string;
    name: string;
}

export interface Sandwich {
    id: string;
    name: string;
    restaurantId: string;
    ingredients?: string[];
}

export function useReviewForm() {
    const { user } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form Data
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [sandwiches, setSandwiches] = useState<Sandwich[]>([]);
    const [globalIngredients, setGlobalIngredients] = useState<string[]>([]);

    // Form State
    const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
    const [newRestaurantName, setNewRestaurantName] = useState('');
    const [newRestaurantWebsite, setNewRestaurantWebsite] = useState('');
    const [newRestaurantAddress, setNewRestaurantAddress] = useState('');
    const [newRestaurantLat, setNewRestaurantLat] = useState<number | undefined>(undefined);
    const [newRestaurantLng, setNewRestaurantLng] = useState<number | undefined>(undefined);
    const [selectedSandwichId, setSelectedSandwichId] = useState('');
    const [newSandwichName, setNewSandwichName] = useState('');
    const [originalIngredients, setOriginalIngredients] = useState<string[]>([]);

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
    const [newIngredient, setNewIngredient] = useState('');
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<string[]>([]);

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

    useEffect(() => {
        if (selectedSandwichId && selectedSandwichId !== 'new') {
            const sandwich = sandwiches.find(s => s.id === selectedSandwichId);
            if (sandwich) {
                const ings = sandwich.ingredients || [];
                setSelectedIngredients(ings);
                setOriginalIngredients(ings);
            }
        } else {
            setSelectedIngredients([]);
            setOriginalIngredients([]);
        }
    }, [selectedSandwichId, sandwiches]);

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
        if (originalIngredients.includes(ing)) return;
        setSelectedIngredients(selectedIngredients.filter(i => i !== ing));
    };

    const handleSubmit = async () => {
        if (!user) return;
        setLoading(true);
        setFormErrors([]);
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
                newRestaurantWebsite: selectedRestaurantId === 'new' ? (newRestaurantWebsite || undefined) : undefined,
                newRestaurantAddress: selectedRestaurantId === 'new' ? (newRestaurantAddress || undefined) : undefined,
                newRestaurantLat: selectedRestaurantId === 'new' ? newRestaurantLat : undefined,
                newRestaurantLng: selectedRestaurantId === 'new' ? newRestaurantLng : undefined,
                newSandwichName: selectedSandwichId === 'new' ? newSandwichName : undefined,
            });
            router.push('/profile');
        } catch (error: any) {
            console.error('Error submitting review:', error);
            if (error.message?.includes('Validation failed')) {
                const errors = error.message.replace('Validation failed: ', '').split(', ');
                setFormErrors(errors);
                setStep(4); // Ensure user sees summary/errors
            } else {
                alert('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        step, setStep,
        loading,
        restaurants, sandwiches, globalIngredients,
        selectedRestaurantId, setSelectedRestaurantId,
        newRestaurantName, setNewRestaurantName,
        newRestaurantWebsite, setNewRestaurantWebsite,
        newRestaurantAddress, setNewRestaurantAddress,
        newRestaurantLat, setNewRestaurantLat,
        newRestaurantLng, setNewRestaurantLng,
        selectedSandwichId, setSelectedSandwichId,
        newSandwichName, setNewSandwichName,
        originalIngredients,
        rating, setRating,
        hoverRating, setHoverRating,
        comment, setComment,
        selectedIngredients, setSelectedIngredients,
        newIngredient, setNewIngredient,
        activeSuggestionIndex, setActiveSuggestionIndex,
        imageFile, setImageFile,
        imagePreview, setImagePreview,
        formErrors,
        handleImageChange,
        addIngredient,
        removeIngredient,
        handleSubmit
    };
}
