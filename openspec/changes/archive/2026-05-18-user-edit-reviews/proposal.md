## Why

Users currently cannot correct mistakes or update their reviews after submission. Providing the ability to edit reviews improves data quality and user satisfaction by allowing them to refine their feedback and keep their profile accurate.

## What Changes

- **Update Review Logic**: Add backend support to update an existing review's rating, comment, and image.
- **Edit UI in Profile**: Add an "Edit" action to review cards on the user's profile page.
- **Unified Review Form**: Refactor the existing `ReviewForm` and `useReviewForm` hook to support an "edit" mode where fields are pre-populated.
- **Image Replacement**: Allow users to upload a new photo which replaces the previous one on the review (maintaining the one-photo-per-review limit).
- **Constraints**: Users cannot change the restaurant or sandwich associated with a review once it is created.

## Capabilities

### New Capabilities
- `edit-user-reviews`: Enables users to modify the content (rating, comment, photo) of reviews they have previously authored.

### Modified Capabilities
<!-- No requirement changes to existing specs. -->

## Impact

- **Backend**: `src/lib/reviews.ts` will need an `updateReview` function.
- **State Management**: `src/hooks/useReviewForm.ts` will need to handle initialization from an existing review.
- **Components**: `src/components/ReviewCard.tsx` will need an edit button; `src/components/ReviewForm.tsx` will need to handle the update submission.
- **Pages**: `src/app/profile/page.tsx` will need to manage the transition to the edit state.
