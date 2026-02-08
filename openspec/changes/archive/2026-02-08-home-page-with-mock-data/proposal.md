## Why

The authenticated dashboard page (`/dashboard`) is a placeholder (`<div>dashboard</div>`). Users need a functional home page that displays daily nutrition tracking at a glance — calorie summary, macronutrient breakdown, water intake, and meal categories. This is the core screen of the app and the first thing users see after login.

## What Changes

- Replace the placeholder dashboard page with a full nutrition tracking home page
- Add a date navigation header (Today / previous / next day)
- Add a calorie summary card showing eaten, burned, remaining, and goal values
- Add macronutrient progress rings for protein, carbs, fat, and fiber
- Add a water intake tracker with glass indicators and +/- controls
- Add a "Today's Meals" section with Breakfast, Lunch, Dinner, and Snacks cards
- All data is mock/static for now — no backend integration yet

## Capabilities

### New Capabilities

- `daily-dashboard`: The main home page displaying daily nutrition overview with calorie summary, macronutrients, water intake, and meal categories

### Modified Capabilities

None

## Impact

- `src/app/(main)/dashboard/page.tsx` — complete rewrite from placeholder
- New client components for each dashboard section
- New shadcn/ui components may need to be installed (card, progress)
- Mock data constants for nutrition targets and meal categories
