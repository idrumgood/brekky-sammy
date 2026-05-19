## 1. UI Components

- [x] 1.1 Create `FilterControls` component in `src/components/` with inputs for derived categories, dietary restrictions, and ingredient "must-haves".
- [x] 1.2 Create `SortControls` component in `src/components/` with a dropdown for "Highest Rated", "Most Popular", and "Recently Added".
- [x] 1.3 Ensure both components are styled and responsive.

## 2. Filtering & Sorting Logic

- [x] 2.1 Implement the `filterAndSortSandwiches` utility function, including the `DIETARY_RULES` and `CATEGORY_RULES` for derived attributes.
- [x] 2.2 Add unit tests for `filterAndSortSandwiches` to verify category, dietary (derived), popularity, and rating logic.
- [x] 2.3 Integrate the logic into the `SearchPage` in `src/app/search/page.tsx`.

## 3. Integration & Refinement

- [x] 3.1 Update `src/app/search/page.tsx` to include the new control components.
- [x] 3.2 Ensure the sandwich list updates automatically when any filter or sort option changes.
- [x] 3.3 Verify that text search results can be further filtered and sorted.

## 4. Final Validation

- [x] 4.1 Perform manual testing of all filter and sort combinations.
- [x] 4.2 Verify that sandwiches with missing data (e.g., no price) are handled gracefully.
- [x] 4.3 Check for any performance issues with large result sets.
