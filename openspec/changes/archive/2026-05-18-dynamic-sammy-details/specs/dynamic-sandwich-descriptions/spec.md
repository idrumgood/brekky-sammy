## ADDED Requirements

### Requirement: Dynamic Sandwich Description Generation
The system SHALL generate a personality-rich, AI-generated description for each breakfast sandwich based on existing member reviews. This generation must be triggered whenever a new review is successfully submitted for a sandwich.

#### Scenario: First Review Submitted
- **WHEN** a member submits the first review for a new sandwich
- **THEN** the system SHALL call the Gemini API with a prompt containing the sandwich name, restaurant name, and the review comment
- **THEN** the system SHALL store the returned description in the sandwich document

#### Scenario: Subsequent Review Submitted
- **WHEN** a member submits a new review for an existing sandwich that already has a description
- **THEN** the system SHALL call the Gemini API with a prompt containing the sandwich name, restaurant name, and ALL existing review comments for that sandwich (including the new one)
- **THEN** the system SHALL update the sandwich document with the newly generated description

### Requirement: Personality-Driven Prompt
The prompt used for Gemini API SHALL be written from the perspective of a passionate breakfast sandwich enthusiast ("Sammy Lover"). It SHALL instruct the AI to be clever, engaging, and to synthesize the collective sentiment of the reviews into a cohesive "Sammy Detail" blurb.

#### Scenario: Prompt Engineering
- **WHEN** generating the description
- **THEN** the prompt MUST explicitly state the persona and the goal of summarizing the "vibe" and specific feedback from the club members

### Requirement: Admin Backfill Capability
The system SHALL provide an administrative tool to retroactively generate descriptions for existing sandwiches that do not yet have one.

#### Scenario: Running Backfill
- **WHEN** an admin triggers the "Generate Missing Descriptions" process
- **THEN** the system SHALL identify all sandwiches missing a description
- **THEN** for each such sandwich, the system SHALL gather all existing reviews and call the Gemini API to generate a description
- **THEN** the system SHALL update each sandwich document with its new description

### Requirement: Displaying Dynamic Details
The sandwich detail page SHALL display the AI-generated `description` if it exists. If no description has been generated yet (e.g., legacy sandwiches with no new reviews), it SHALL fall back to a default template or show nothing until a review triggers generation.

#### Scenario: Viewing Sandwich with Description
- **WHEN** a user navigates to a sandwich detail page where `description` is present in the database
- **THEN** the system SHALL render this description in the "Sammy Details" section

#### Scenario: Viewing Sandwich without Description
- **WHEN** a user navigates to a sandwich detail page where `description` is missing
- **THEN** the system SHALL render a fallback informative message or the previous hardcoded template until a new review triggers generation
