## Context

The current sandwich search functionality in `src/app/search/page.tsx` performs a full fetch of sandwiches from Firestore and filters them client-side based on a simple text match. While effective for small datasets, it lacks the structured filtering and sorting capabilities required for a better user experience.

## Goals / Non-Goals

**Goals:**
- Add structured filtering for derived categories (Burritos, Bagels, etc.), dietary restrictions (Vegan, Vegetarian), and ingredients.
- Add sorting by rating, popularity (review count), and date.
- Maintain seamless integration with the existing text search.
- Ensure the UI remains responsive and intuitive.

**Non-Goals:**
- Sorting or filtering by price (data is not currently available).
- Implementing server-side filtering/sorting via Firestore composite indexes (client-side is sufficient for current scale).

## Decisions

### 1. Client-side Filtering and Sorting
We will continue to fetch all sandwiches (or a large enough subset) and perform filtering and sorting on the client.
- **Rationale**: Firestore composite queries require specific indexes for every combination of filters and sorts. Client-side processing is fast for the expected dataset size and allows for complex derived logic (e.g., checking ingredient lists for dietary flags) that is difficult to perform in Firestore queries.

### 2. Derived Attribute Engine
We will implement a utility that maps sandwich metadata (name and ingredients) to dietary and category tags.
- **Dietary Rules**: Exclusion-based rules for Vegan/Vegetarian (e.g., if ingredients include "bacon", it's not vegetarian).
- **Category Rules**: Keyword-based rules (e.g., if name includes "Burrito" or ingredients include "tortilla", it's a Burrito).

### 3. New UI Components
We will introduce `FilterControls` and `SortControls` components.
- **Rationale**: Decoupling the UI from the main page logic makes it easier to test and reuse.

## Risks / Trade-offs

- **[Risk] Accuracy of Derived Data** → Inferred categories or dietary status might be wrong if ingredients are incomplete or misspelled. *Mitigation*: The UI will allow users to "Must Include" specific ingredients to override broad filters.
- **[Risk] Performance Degradation** → As the number of sandwiches grows, client-side filtering may slow down. *Mitigation*: If the dataset exceeds ~1000 items, we will investigate indexing or simpler server-side filters.
