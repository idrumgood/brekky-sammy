## Context

The current review system supports creating reviews but lacks an update mechanism. Reviews are stored in the `reviews` collection, with aggregate data (rating, photo lists) stored in the `sandwiches` collection.

## Goals / Non-Goals

**Goals:**
- Implement a thread-safe `updateReview` function in the library.
- Refactor the existing multi-step `ReviewForm` to support editing an existing review.
- Ensure sandwich aggregate ratings are correctly updated when a review rating changes.

**Non-Goals:**
- Allowing changes to the restaurant or sandwich of a review.
- Deleting old images from Firebase Storage when a new one is uploaded (out of scope for now).
- Regenerating the AI-generated sandwich description on edit.

## Decisions

### 1. Unified `ReviewForm` via Edit Mode
Instead of creating a new form, we will enhance `ReviewForm` and `useReviewForm` to accept an optional `reviewToEdit` prop.
- **Rationale**: The UI for editing (rating, comment, photo) is identical to creation. Reusing the component ensures consistency and reduces maintenance.
- **Alternatives**: Create a separate `EditReviewForm`. Rejected because of high code duplication.

### 2. Transactional Score Re-calculation
When a review rating is updated, we must recalculate the sandwich's `averageRating`.
- **Rationale**: Since Firestore doesn't support automatic aggregations, we must manually update the sandwich document. A transaction ensures the review update and sandwich update are atomic and consistent.
- **Formula**: `newAvg = ((currentAvg * count) - oldRating + newRating) / count`.

### 3. Image Upload Logic
The `updateReview` function will check if a new `imageFile` is provided.
- **Rationale**: If provided, it will be uploaded via `uploadReviewImage`, and the `imageUrl` in the review will be updated. The `sandwiches.allPhotos` array will also be updated (replacing the old photo URL if found, or adding the new one).
- **Note**: The user requested that only one photo is "active" for the review, but sandwiches maintain a gallery. We will replace the specific photo associated with this review in the sandwich's `allPhotos` array.

## Risks / Trade-offs

- **[Risk]** Data inconsistency if a transaction fails halfway.
  - **Mitigation**: Standard Firestore transaction retries and error handling.
- **[Risk]** Stale data in the UI after update.
  - **Mitigation**: Force a refresh of the profile data or use local state updates in the profile page after a successful edit.
