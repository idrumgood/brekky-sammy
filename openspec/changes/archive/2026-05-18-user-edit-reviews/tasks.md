## 1. Library & Backend

- [x] 1.1 Implement `updateReview` in `src/lib/reviews.ts` using a Firestore transaction.
- [x] 1.2 Add logic to `updateReview` to recalculate the sandwich `averageRating` when the review rating changes.
- [x] 1.3 Add logic to `updateReview` to handle image replacement in both the review and the sandwich's `allPhotos` list.
- [x] 1.4 Ensure `updateReview` does NOT call `updateSandwichDescription`.

## 2. Hook & State Management

- [x] 2.1 Update `useReviewForm` to accept a `reviewToEdit` parameter.
- [x] 2.2 Implement pre-population of form state (rating, comment, ingredients, image preview) in `useReviewForm` when `reviewToEdit` is provided.
- [x] 2.3 Refactor `handleSubmit` in `useReviewForm` to toggle between `createReview` and `updateReview` based on the mode.

## 3. UI Components

- [x] 3.1 Update `ReviewCard.tsx` to include an "Edit" button that triggers an `onEdit` callback.
- [x] 3.2 Ensure the "Edit" button in `ReviewCard` is only visible if the `userId` matches the review's author.
- [x] 3.3 Modify `ReviewForm.tsx` and its steps to handle "Edit Mode":
    - Disable or hide the Restaurant and Sandwich selection steps (Step 1).
    - Ensure Step 2 (Rating/Ingredients) and Step 3 (Photo/Comment) are pre-filled.
- [x] 3.4 Add an `EditReviewModal` (or similar) to `src/app/profile/page.tsx` that wraps the `ReviewForm`.

## 4. Integration & Validation

- [x] 4.1 Connect the "Edit" button in the profile's review list to the edit modal.
- [x] 4.2 Verify that a successful edit refreshes the profile's review list.
- [x] 4.3 Add a unit test in `src/test/unit/reviews.test.ts` to verify `updateReview` behavior and score re-calculation.
- [x] 4.4 Manually verify that editing a review does not change the sandwich's `description` or `descriptionUpdatedAt`.
