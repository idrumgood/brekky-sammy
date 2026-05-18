## Context

The current application uses static templates to describe sandwiches. We want to leverage LLMs (Gemini API) to create dynamic, review-driven descriptions. The application uses Firebase (Firestore, Auth, Storage) and Next.js.

## Goals / Non-Goals

**Goals:**
- Automatically generate a "Sammy Detail" blurb when a review is submitted.
- Persist this description in Firestore.
- Display the dynamic description on the sandwich detail page.
- Maintain a consistent, "passionate lover of breakfast sandwiches" persona in the AI output.
- Retroactively generate descriptions for all existing sandwiches (one-time backfill).

**Non-Goals:**
- Real-time generation on every page load (descriptions are cached in the DB).
- Moderation of AI content beyond standard Gemini safety filters.

## Decisions

### 1. Integration Point: Post-Transaction Hook
- **Decision**: Trigger the Gemini API call and subsequent DB update *after* the `createReview` transaction successfully completes.
- **Rationale**: Firestore transactions must be atomic and should not include long-running or unreliable external network calls (like an AI API). By doing it post-transaction, we ensure the core review data is saved regardless of the AI's success or failure.
- **Alternative**: Cloud Functions. While cleaner for background tasks, adding a new infrastructure component (Firebase Functions) just for this might be overkill if we can handle it in the application code for now.

### 2. Service Layer: `src/lib/gemini.ts`
- **Decision**: Create a dedicated utility for Gemini interactions.
- **Rationale**: Encapsulates the configuration and prompt engineering logic, making it easier to test and modify without touching business logic in `reviews.ts`.

### 3. Persona and Prompt Engineering
- **Decision**: Use a "system-style" instruction in the prompt to define the "Sammy Lover" persona.
- **Rationale**: Ensures consistency in tone (clever, engaging, breakfast-obsessed).
- **Prompt Structure**:
  ```text
  You are the world's most passionate breakfast sandwich enthusiast. 
  Your mission is to write a clever, engaging, and mouth-watering summary 
  (the "Sammy Detail") for a sandwich called [NAME] from [RESTAURANT].
  
  Here are the latest member reviews:
  [LIST OF COMMENTS]
  
  Synthesize these reviews into a single paragraph (2-4 sentences) that captures 
  the vibe, the highlights, and the consensus of the Sunday Brunch Club. 
  Be witty and focused on the breakfast sandwich experience.
  ```

### 4. Data Storage: `sandwiches.description`
- **Decision**: Add a `description` field directly to the `Sandwich` document.
- **Rationale**: Simple, efficient for reads, and directly associated with the sandwich entity.

### 5. Backfill Strategy: Admin UI Trigger
- **Decision**: Implement a manual "Generate Descriptions" trigger in the Admin Sandwiches view.
- **Rationale**: Given the small volume of existing sandwiches (< 20), a client-side triggered batch process in the admin panel is the simplest and most cost-effective way to handle the one-time backfill.
- **Implementation**: A function in `src/lib/admin.ts` will iterate through sandwiches without descriptions and call the Gemini service.

## Risks / Trade-offs

- **[Risk] API Latency/Failure** → **Mitigation**: The description update happens asynchronously after the review is saved. If it fails, the user still sees their review, and the sandwich just keeps its old/missing description.
- **[Risk] Cost/Quota** → **Mitigation**: Descriptions are only updated on *new* review submissions, not on every page view.
- **[Risk] Inappropriate Content** → **Mitigation**: Rely on Gemini's built-in safety filters and provide a clear system prompt.
