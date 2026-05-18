## ADDED Requirements

### Requirement: Authorize Review Edit
The system SHALL only allow the original author of a review to initiate and save modifications to that review.

#### Scenario: Author sees edit option
- **WHEN** a logged-in user views their own review on their profile page
- **THEN** an "Edit" button or icon MUST be visible and functional

#### Scenario: Non-author cannot see edit option
- **WHEN** a user views a review authored by someone else
- **THEN** the "Edit" button MUST NOT be visible

### Requirement: Modifiable Review Content
The system SHALL allow users to update the numerical star rating, the text comment, and the associated photo of their existing review.

#### Scenario: Successfully updating rating and comment
- **WHEN** a user changes their rating from 4 to 5 and updates their comment text
- **THEN** the system MUST save the new values and reflect them in the UI

### Requirement: Immutable Review Context
The system SHALL NOT allow users to change the restaurant or the sandwich associated with an existing review during the edit process.

#### Scenario: Restaurant and Sandwich fields are read-only
- **WHEN** a user opens the edit form for a review
- **THEN** the restaurant and sandwich selection MUST be disabled or displayed as read-only text

### Requirement: Single Photo Update
The system SHALL allow users to either keep their existing photo, upload a new photo to replace the existing one, or remove the photo entirely (if applicable). Only one photo SHALL be stored per review.

#### Scenario: Replacing an existing photo
- **WHEN** a user uploads a new image while editing a review that already had a photo
- **THEN** the new image MUST replace the old one in the review record

### Requirement: Automatic Score Re-calculation
The system SHALL update the aggregate statistics (average rating) of the associated sandwich when a review's rating is modified.

#### Scenario: Rating change updates sandwich average
- **WHEN** a user changes a review rating from 1 to 5
- **THEN** the sandwich's average rating MUST be re-calculated using the new value

### Requirement: Prevent AI Description Trigger on Edit
The system SHALL NOT trigger the AI sandwich description regeneration process when a review is edited.

#### Scenario: Editing comment does not update description
- **WHEN** a user edits their review comment
- **THEN** the `descriptionUpdatedAt` and `description` fields of the sandwich MUST NOT change
