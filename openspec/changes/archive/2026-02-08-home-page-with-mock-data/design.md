## Context

The dashboard page at `/dashboard` is currently a placeholder. This is the primary screen users see after authentication. The app uses Next.js 16 App Router, shadcn/ui (base-maia style), Phosphor icons, and Tailwind CSS v4. The `(main)` layout already provides session context and a bottom navbar.

The image reference shows a mobile-first nutrition dashboard with: date navigation, calorie ring, macronutrient mini-rings, water intake tracker, and meal category cards.

## Goals / Non-Goals

**Goals:**

- Build a polished, mobile-first dashboard matching the reference design
- Use modern shadcn/ui Card component for sections
- All data is hardcoded mock data — ready to swap with real data later
- Client-side interactivity for water intake (+/- buttons) and date navigation
- Clean component decomposition for future reuse

**Non-Goals:**

- No backend/API integration — all mock data
- No persistent state — water count resets on refresh
- No actual date filtering logic
- No food logging from this page (Add Food button links to `/add`)

## Decisions

### 1. Component structure

Create a single `dashboard/page.tsx` as a client component that composes smaller section components. Each section is a separate component file in `src/components/dashboard/`:

- `DateNavigation` — day selector with left/right arrows
- `CalorieSummary` — circular progress ring + eaten/burned/remaining/goal stats
- `MacronutrientCards` — 4 mini ring cards for protein, carbs, fat, fiber
- `WaterIntake` — glass indicators with +/- buttons (local state via useState)
- `MealList` — list of meal category cards (Breakfast, Lunch, Dinner, Snacks)

**Rationale**: Small, focused components are easier to maintain and will simplify future integration with real data.

### 2. Circular progress rings

Use SVG-based circular progress indicators built as a custom `CircleProgress` component. No external charting library needed for simple rings.

**Rationale**: The design shows ring/donut charts which are simple SVG circles with `stroke-dasharray`. Adding a charting library for this would be overkill.

### 3. shadcn/ui components to install

- `card` — for section containers (calorie summary, macro cards, meal cards, water intake)

**Rationale**: Card provides consistent styling. The progress component is linear and won't match the circular design, so we build custom SVG rings instead.

### 4. Mock data approach

Define mock data as constants in `src/lib/mock-data.ts`:

- Daily nutrition goals (calories: 2000, protein: 150g, carbs: 250g, fat: 65g, fiber: 30g)
- Current intake values (all 0 for "empty" state matching the reference)
- Meal categories with emoji icons, names, and empty items
- Water goal: 8 glasses

**Rationale**: Centralized mock data file makes it easy to swap with real data sources later.

### 5. Styling approach

- Mobile-first design with Tailwind CSS v4
- Green gradient header matching the reference aesthetic (emerald tones)
- Use shadcn Card for elevated sections
- Phosphor icons for navigation arrows and water icon

## Risks / Trade-offs

- [SVG rings are custom code] → Simple implementation, well-understood pattern, no dependency risk
- [Mock data creates dead UI] → Clearly scoped as phase 1; structure supports easy data source swap
- [No responsive desktop layout] → App is mobile-first by design; desktop can be addressed later
