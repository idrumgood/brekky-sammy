'use client';

import { useReviewForm } from '@/hooks/useReviewForm';
import { RestaurantStep } from './review/RestaurantStep';
import { RatingStep } from './review/RatingStep';
import { PhotoStep } from './review/PhotoStep';
import { SummaryStep } from './review/SummaryStep';

export default function ReviewForm() {
    const {
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
        selectedIngredients,
        newIngredient, setNewIngredient,
        activeSuggestionIndex, setActiveSuggestionIndex,
        imagePreview, setImagePreview,
        setImageFile,
        formErrors,
        handleImageChange,
        addIngredient,
        removeIngredient,
        handleSubmit
    } = useReviewForm();

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border border-border relative overflow-hidden">
            {/* Progress Bar */}
            <div className="h-2 w-full bg-secondary">
                <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${(step / 4) * 100}%` }}
                />
            </div>

            {formErrors.length > 0 && (
                <div className="bg-destructive/10 border-b border-destructive/20 p-4">
                    <div className="flex flex-col gap-1">
                        <p className="text-destructive font-bold text-sm">Please fix the following errors:</p>
                        <ul className="list-disc list-inside text-destructive/80 text-xs">
                            {formErrors.map((err, i) => <li key={i}>{err}</li>)}
                        </ul>
                    </div>
                </div>
            )}

            <div className="p-8 md:p-12">
                {step === 1 && (
                    <RestaurantStep
                        restaurants={restaurants}
                        sandwiches={sandwiches}
                        selectedRestaurantId={selectedRestaurantId}
                        setSelectedRestaurantId={setSelectedRestaurantId}
                        newRestaurantName={newRestaurantName}
                        setNewRestaurantName={setNewRestaurantName}
                        newRestaurantWebsite={newRestaurantWebsite}
                        setNewRestaurantWebsite={setNewRestaurantWebsite}
                        newRestaurantAddress={newRestaurantAddress}
                        setNewRestaurantAddress={setNewRestaurantAddress}
                        newRestaurantLat={newRestaurantLat}
                        setNewRestaurantLat={setNewRestaurantLat}
                        newRestaurantLng={newRestaurantLng}
                        setNewRestaurantLng={setNewRestaurantLng}
                        selectedSandwichId={selectedSandwichId}
                        setSelectedSandwichId={setSelectedSandwichId}
                        newSandwichName={newSandwichName}
                        setNewSandwichName={setNewSandwichName}
                        onNext={() => setStep(2)}
                    />
                )}

                {step === 2 && (
                    <RatingStep
                        rating={rating}
                        setRating={setRating}
                        hoverRating={hoverRating}
                        setHoverRating={setHoverRating}
                        selectedIngredients={selectedIngredients}
                        originalIngredients={originalIngredients}
                        globalIngredients={globalIngredients}
                        newIngredient={newIngredient}
                        setNewIngredient={setNewIngredient}
                        activeSuggestionIndex={activeSuggestionIndex}
                        setActiveSuggestionIndex={setActiveSuggestionIndex}
                        addIngredient={addIngredient}
                        removeIngredient={removeIngredient}
                        onBack={() => setStep(1)}
                        onNext={() => setStep(3)}
                    />
                )}

                {step === 3 && (
                    <PhotoStep
                        imagePreview={imagePreview}
                        setImageFile={setImageFile}
                        setImagePreview={setImagePreview}
                        comment={comment}
                        setComment={setComment}
                        handleImageChange={handleImageChange}
                        onBack={() => setStep(2)}
                        onNext={() => setStep(4)}
                    />
                )}

                {step === 4 && (
                    <SummaryStep
                        selectedRestaurantId={selectedRestaurantId}
                        newRestaurantName={newRestaurantName}
                        restaurants={restaurants}
                        selectedSandwichId={selectedSandwichId}
                        newSandwichName={newSandwichName}
                        sandwiches={sandwiches}
                        rating={rating}
                        selectedIngredients={selectedIngredients}
                        comment={comment}
                        loading={loading}
                        onBack={() => setStep(3)}
                        onSubmit={handleSubmit}
                    />
                )}
            </div>
        </div>
    );
}
