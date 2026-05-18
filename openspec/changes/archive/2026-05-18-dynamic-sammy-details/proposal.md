## Why

The current "Sammy Details" section on the sandwich page is static and template-based, providing a generic experience for every sandwich. By using the Gemini API to generate dynamic descriptions based on actual member reviews, we can create a much more engaging, personality-driven, and informative section that reflects the community's consensus. This adds a unique "social proof" element to the application and makes each sandwich feel distinct.

## What Changes

- **Database Schema**: Add a `description` field to the `sandwiches` collection in Firestore.
- **Data Model**: Update the `Sandwich` interface to include the new `description` field.
- **Service Layer**: Implement a new service to interact with the Gemini API.
- **Review Logic**: Update the review creation flow to trigger a description update whenever a new review is submitted.
- **UI**: Modify the sandwich detail page to display the AI-generated description instead of the hardcoded template.
- **Admin Tools**: Add a one-time backfill script/button to generate descriptions for existing sandwiches.

## Capabilities

### New Capabilities
- `dynamic-sandwich-descriptions`: Generates and stores a personality-rich description for a sandwich based on its reviews using the Gemini API.

### Modified Capabilities
- (None)

## Impact

- `src/lib/sandwiches.ts`: Interface change and potentially a new update function if needed (though one already exists).
- `src/lib/reviews.ts`: Integration of the description generation trigger after a successful review submission.
- `src/app/admin/sandwiches/page.tsx`: Add a backfill button for admins.
- `src/lib/admin.ts`: Add logic for batch generating descriptions.
- `src/app/sandwich/[id]/page.tsx`: UI update to show the generated description.
- New dependency: `@google/generative-ai` for Gemini API access.
- New environment variable: `GOOGLE_GENERATIVE_AI_API_KEY`.
