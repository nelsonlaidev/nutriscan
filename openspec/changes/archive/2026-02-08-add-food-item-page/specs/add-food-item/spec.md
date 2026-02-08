## ADDED Requirements

### Requirement: Mode selector

The add food item page SHALL display a segmented control at the top with three modes: "AI Scan" (Camera icon), "Manual" (PencilSimple icon), and "Barcode" (Barcode icon). The active mode SHALL be visually highlighted. Tapping a mode SHALL switch the content area below to that mode's interface.

#### Scenario: Default mode on page load

- **WHEN** user navigates to `/add`
- **THEN** the page displays with "AI Scan" mode selected by default and the AI image capture interface visible

#### Scenario: Switch between modes

- **WHEN** user taps a different mode in the segmented control
- **THEN** the content area switches to that mode's interface and the selected tab is highlighted

### Requirement: Page header with back navigation

The page SHALL display a header with a back arrow button and the title "Add Food". Tapping the back button SHALL navigate the user back to the previous page.

#### Scenario: Display header

- **WHEN** user loads the add food page
- **THEN** a header shows "Add Food" with a back arrow button on the left

#### Scenario: Navigate back

- **WHEN** user taps the back arrow
- **THEN** the user is navigated back (router.back())

### Requirement: AI Image Recognition mode

The AI Image mode SHALL display a large camera viewfinder area with a "Take Photo" button and an "Upload Photo" button below it. The viewfinder area SHALL show a camera icon placeholder when inactive.

#### Scenario: Display AI Image capture UI

- **WHEN** the AI Scan mode is active
- **THEN** a camera viewfinder placeholder is displayed with a "Take Photo" primary button and an "Upload Photo" secondary button

#### Scenario: Take photo (mock)

- **WHEN** user taps "Take Photo"
- **THEN** a loading state displays briefly, then a mock nutrition result appears showing food name "Grilled Chicken Breast", serving "100g", calories 165, protein 31g, carbs 0g, fat 3.6g, fiber 0g

#### Scenario: Upload photo (mock)

- **WHEN** user taps "Upload Photo"
- **THEN** a loading state displays briefly, then a mock nutrition result appears with the same mock data

### Requirement: Manual Entry mode

The Manual Entry mode SHALL display a form with fields for: Food Name (required text), Serving Size (required text with unit hint), Calories (required number), Protein (number), Carbs (number), Fat (number), and Fiber (number). All nutritional fields SHALL default to 0.

#### Scenario: Display manual entry form

- **WHEN** the Manual mode is active
- **THEN** a form displays with Food Name, Serving Size, Calories, Protein, Carbs, Fat, and Fiber fields

#### Scenario: Validate required fields

- **WHEN** user taps "Add" without entering a food name or serving size
- **THEN** validation errors display on the required fields

#### Scenario: Valid form submission

- **WHEN** user fills in food name, serving size, and calories, then taps "Add"
- **THEN** the meal category picker is shown for meal selection

### Requirement: Barcode Scanner mode

The Barcode Scanner mode SHALL display a camera viewfinder area with a scanning frame overlay and status text "Point camera at barcode". A "Scan" button SHALL trigger the scan action.

#### Scenario: Display barcode scanner UI

- **WHEN** the Barcode mode is active
- **THEN** a camera viewfinder placeholder with scanning frame overlay is displayed, with status text "Point camera at barcode" and a "Scan" button

#### Scenario: Scan barcode (mock)

- **WHEN** user taps "Scan"
- **THEN** a loading state displays with "Scanning..." text, then after a brief delay a mock nutrition result appears showing product name "Organic Granola Bar", serving "40g", calories 180, protein 4g, carbs 28g, fat 7g, fiber 3g

### Requirement: Nutrition result display

After a successful AI scan or barcode scan, the page SHALL display an editable nutrition result card showing: food name, serving size, calories, protein, carbs, fat, and fiber. All nutritional values SHALL be editable. A "Confirm" button SHALL proceed to meal category selection.

#### Scenario: Display nutrition result

- **WHEN** a scan (AI or barcode) completes successfully
- **THEN** a result card displays with the food name, serving size, and all macronutrient values in editable fields

#### Scenario: Edit nutrition values

- **WHEN** user modifies a nutritional value in the result card
- **THEN** the value updates in place

#### Scenario: Confirm nutrition result

- **WHEN** user taps "Confirm"
- **THEN** the meal category picker is shown

### Requirement: Meal category picker

After confirming nutritional data (from any mode), a meal category picker SHALL appear with four options: Breakfast, Lunch, Dinner, and Snacks. Each option SHALL display its emoji icon and name matching the dashboard meal categories. Selecting a category and tapping "Add to Meal" SHALL confirm the food item.

#### Scenario: Display meal categories

- **WHEN** the meal category picker is shown
- **THEN** four options display: Breakfast (🍞), Lunch (🌤️), Dinner (🌙), Snacks (🍿)

#### Scenario: Select meal category

- **WHEN** user taps a meal category
- **THEN** that category is visually selected with a highlight/border

#### Scenario: Confirm food item

- **WHEN** user taps "Add to Meal" with a meal category selected
- **THEN** a success toast displays "Food added to [meal name]!" and the user is navigated back to the dashboard

#### Scenario: No category selected

- **WHEN** user taps "Add to Meal" without selecting a category
- **THEN** a validation message prompts user to select a meal category
