## 1. Setup

- [x] 1.1 Install shadcn/ui `card` component
- [x] 1.2 Create mock data file at `src/lib/mock-data.ts` with nutrition goals, meal categories, and water target

## 2. Shared Components

- [x] 2.1 Create `CircleProgress` SVG component at `src/components/dashboard/circle-progress.tsx`

## 3. Dashboard Sections

- [x] 3.1 Create `DateNavigation` component with day selector and arrow buttons
- [x] 3.2 Create `CalorieSummary` component with circular ring and eaten/burned/remaining/goal stats
- [x] 3.3 Create `MacronutrientCards` component with 4 mini-ring cards (protein, carbs, fat, fiber)
- [x] 3.4 Create `WaterIntake` component with glass indicators and +/- buttons (useState for count)
- [x] 3.5 Create `MealList` component with 4 meal category cards and "Add Food" link

## 4. Page Assembly

- [x] 4.1 Rewrite `src/app/(main)/dashboard/page.tsx` to compose all dashboard sections with green gradient header styling
- [x] 4.2 Verify the page renders correctly and passes `pnpm check`
