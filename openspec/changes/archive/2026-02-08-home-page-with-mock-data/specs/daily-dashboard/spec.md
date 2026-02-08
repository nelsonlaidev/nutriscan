## ADDED Requirements

### Requirement: Date navigation header

The dashboard SHALL display a date navigation bar showing the current date label ("Today") and the formatted date (e.g., "Feb 8, 2026"). Left and right arrow buttons SHALL allow navigating between days.

#### Scenario: Display current date

- **WHEN** user loads the dashboard
- **THEN** the header displays "Today" with the current date formatted as "MMM D, YYYY"

#### Scenario: Navigate to previous day

- **WHEN** user taps the left arrow
- **THEN** the date updates to the previous day and the label changes from "Today" to the day name or date

#### Scenario: Navigate to next day

- **WHEN** user taps the right arrow
- **THEN** the date updates to the next day (up to today's date)

### Requirement: Calorie summary card

The dashboard SHALL display a calorie summary card with a circular progress ring showing consumed calories out of the daily goal. The card SHALL show Eaten, Burned, Remaining, and Goal values.

#### Scenario: Display calorie summary with mock data

- **WHEN** the dashboard loads
- **THEN** a circular ring displays "0 kcal of 2000", Eaten shows "0", Burned shows "0", Remaining shows "2000" in green, and Goal shows "2000"

### Requirement: Macronutrient breakdown

The dashboard SHALL display four macronutrient cards in a horizontal row: Protein, Carbs, Fat, and Fiber. Each card SHALL show a circular mini-ring, the current intake in grams, and the daily target.

#### Scenario: Display macronutrient cards with mock data

- **WHEN** the dashboard loads
- **THEN** four cards display: Protein (0g / 150g), Carbs (0g / 250g), Fat (0g / 65g), Fiber (0g / 30g), each with an empty progress ring

### Requirement: Water intake tracker

The dashboard SHALL display a water intake section showing the current count out of 8 glasses. Glass indicators SHALL visually represent filled/empty state. Plus and minus buttons SHALL increment/decrement the count.

#### Scenario: Display empty water intake

- **WHEN** the dashboard loads
- **THEN** the section shows "0 / 8 glasses" with all glass indicators in empty state

#### Scenario: Increment water intake

- **WHEN** user taps the plus button
- **THEN** the water count increases by 1 and the corresponding glass indicator fills

#### Scenario: Decrement water intake

- **WHEN** user taps the minus button and count is greater than 0
- **THEN** the water count decreases by 1 and the corresponding glass indicator empties

#### Scenario: Maximum water intake

- **WHEN** user taps the plus button and count is already 8
- **THEN** the count does not increase beyond 8

### Requirement: Today's meals section

The dashboard SHALL display a "Today's Meals" section with an "Add Food" button and four meal category cards: Breakfast, Lunch, Dinner, and Snacks. Each card SHALL show a colored emoji icon, the meal name, item count, and calorie total.

#### Scenario: Display meal categories with mock data

- **WHEN** the dashboard loads
- **THEN** four meal cards display: Breakfast (0 items, 0 kcal), Lunch (0 items, 0 kcal), Dinner (0 items, 0 kcal), Snacks (0 items, 0 kcal)

#### Scenario: Add Food button

- **WHEN** user taps the "Add Food" button
- **THEN** user is navigated to the `/add` route
