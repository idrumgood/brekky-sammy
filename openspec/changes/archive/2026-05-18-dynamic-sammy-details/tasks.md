## 1. Environment and Data Model

- [x] 1.1 Install `@google/generative-ai` dependency
- [x] 1.2 Add `GOOGLE_GENERATIVE_AI_API_KEY` placeholder to `.env.example` (or just ensure it's in the design for manual setup)
- [x] 1.3 Update `Sandwich` interface in `src/lib/sandwiches.ts` to include `description?: string`

## 2. Gemini Service Implementation

- [x] 2.1 Create `src/lib/gemini.ts` with Gemini API configuration
- [x] 2.2 Implement `generateSandwichDescription` function in `src/lib/gemini.ts` with the "Sammy Lover" prompt
- [x] 2.3 Add unit tests for `generateSandwichDescription` (mocking the Gemini API)

## 3. Review Logic Integration

- [x] 3.1 Update `createReview` in `src/lib/reviews.ts` to call a background function for description update after transaction success
- [x] 3.2 Implement `updateSandwichDescription` helper in `src/lib/reviews.ts` that fetches all reviews and calls Gemini
- [x] 3.3 Ensure error handling so AI failures don't break the review flow

## 4. UI Updates

- [x] 4.1 Update `src/app/sandwich/[id]/page.tsx` to check for `sandwich.description`
- [x] 4.2 Render the AI description if present, otherwise fall back to the existing template
- [x] 4.3 Style the AI description to look integrated and distinct (maybe a slightly different font or icon)

## 5. Backfill Implementation

- [x] 5.1 Implement `backfillSandwichDescriptions` in `src/lib/admin.ts`
- [x] 5.2 Add a "Generate Missing Descriptions" button to the Sandwiches Admin page (`src/app/admin/sandwiches/page.tsx`)
- [x] 5.3 Implement progress tracking and error reporting for the backfill process in the UI

## 6. Verification

- [x] 6.1 Verify the end-to-end flow by submitting a review and checking if the description updates in Firestore and the UI
- [x] 6.2 Test the backfill process with a subset of existing sandwiches
