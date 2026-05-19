## Why

Currently, users can only search for sandwiches by name or description. There is no way to filter results (e.g., by dietary preferences, categories) or sort them (e.g., by rating, popularity, or date added). This makes it difficult for users to find specific types of sandwiches or identify the best-rated options, especially as the database grows.

## What Changes

- **Filter UI**: Introduce a filter panel or dropdown in the Search and "All Sandwiches" views to allow users to filter by derived categories (e.g., Burritos, Bagels, Tacos), dietary restrictions (e.g., Vegan, Vegetarian), and specific ingredient "must-haves".
- **Sorting Options**: Add a sorting menu to order results by "Highest Rated", "Most Popular" (review count), and "Recently Added".
- **Dynamic Updates**: Ensure the sandwich list updates reactively when filters or sorting options are changed.
- **Search Integration**: Filters and sorting should work in conjunction with the text search query.
- **Derived Logic**: Implement logic to infer dietary status and categories from existing sandwich metadata (name and ingredients).

## Capabilities

### New Capabilities
- `sandwich-filtering-sorting`: Provides the UI and logic for filtering and sorting sandwich listings based on various attributes like rating, price, and category.

### Modified Capabilities
<!-- No existing spec-level requirements are changing; this is purely an additive feature. -->

## Impact

- `src/app/search/page.tsx`: Major update to include filter/sort UI and logic.
- `src/lib/sandwiches.ts`: Potential additions to data fetching/processing for filtered results.
- `src/components/`: New components for Filter and Sort controls.
