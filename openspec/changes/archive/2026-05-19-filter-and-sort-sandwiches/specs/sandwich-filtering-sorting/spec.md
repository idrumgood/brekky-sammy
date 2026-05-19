## ADDED Requirements

### Requirement: Filter by Category
The system SHALL allow users to filter the sandwich list by one or more categories (e.g., Breakfast, Lunch, Special).

#### Scenario: Filter by Breakfast
- **WHEN** the user selects the "Breakfast" category filter
- **THEN** the sandwich list displays only sandwiches tagged with the "Breakfast" category

### Requirement: Filter by Dietary Restrictions (Derived)
The system SHALL allow users to filter sandwiches based on derived dietary restrictions, including Vegan and Vegetarian, by analyzing the ingredient list.

#### Scenario: Filter by Vegan
- **WHEN** the user selects the "Vegan" dietary filter
- **THEN** only sandwiches whose ingredients do not contain animal products (e.g., egg, cheese, meat) are displayed

### Requirement: Filter by Category (Derived)
The system SHALL allow users to filter the sandwich list by derived categories (e.g., Burritos, Bagels, Tacos) based on keywords in the name or ingredients.

#### Scenario: Filter by Burritos
- **WHEN** the user selects the "Burritos" category filter
- **THEN** the sandwich list displays sandwiches with "Burrito" in the name or "tortilla" in the ingredients

### Requirement: Sort by Rating
The system SHALL allow users to sort the results by average user rating in descending order.

#### Scenario: Sort by highest rated
- **WHEN** the user selects the "Highest Rated" sorting option
- **THEN** the sandwiches with the highest average ratings appear at the top of the list

### Requirement: Sort by Popularity
The system SHALL allow users to sort results by the number of reviews in descending order.

#### Scenario: Sort by most popular
- **WHEN** the user selects the "Most Popular" sorting option
- **THEN** the sandwiches with the most reviews appear first in the list

### Requirement: Sort by Recency
The system SHALL allow users to sort results by the date they were added, with the most recent appearing first.

#### Scenario: Sort by recently added
- **WHEN** the user selects the "Recently Added" sorting option
- **THEN** the sandwiches added most recently appear at the top of the list
