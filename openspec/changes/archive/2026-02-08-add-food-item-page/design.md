## Context

The `/add` route currently renders a placeholder `<div>add</div>`. The dashboard already links to `/add` via the floating "+" button in the Navbar and the "Add Food" button in the meals section. The page needs to support three food input modes: AI image recognition, manual entry, and barcode scanning.

The app uses React 19 with Next.js 16 App Router, Tailwind CSS v4, shadcn/ui components, Phosphor icons, and Jotai for state. All authenticated pages live under the `(main)/` layout group which provides session context and the bottom Navbar.

No food item database schema exists yet — this change focuses on the UI/UX with mock data handling. Backend integration will follow.

## Goals / Non-Goals

**Goals:**

- Build a polished add-food-item page with three input modes accessible via a tab selector
- AI Image mode: camera/photo upload UI with a results preview showing detected food + editable nutritional values
- Manual mode: form with food name, serving size, calories, protein, carbs, fat, fiber
- Barcode mode: camera viewfinder UI with scan state feedback
- Meal category selection (Breakfast/Lunch/Dinner/Snacks) before confirming
- Match existing app design language (rounded cards, Phosphor icons, primary color accents)

**Non-Goals:**

- Actual AI image recognition API integration (mock the response)
- Actual barcode scanning library integration (mock the scan)
- Database persistence of food items (use mock/toast confirmation)
- Nutritional database or food search API
- Editing previously logged food items

## Decisions

### Page structure: Single page with tab modes

The page will be a single route (`/add`) with a segmented control/tab bar at the top to switch between AI Image, Manual, and Barcode modes. This keeps navigation simple — one entry point from the Navbar button.

**Alternative considered**: Separate sub-routes (`/add/scan`, `/add/manual`, `/add/barcode`). Rejected because mode switching should feel instant without page transitions, and the shared meal-category selector at the bottom benefits from being part of one component tree.

### Tab selector: Custom segmented control

A horizontal segmented control with three options, each showing an icon and label. Styled to match the app's rounded aesthetic. This is more compact and mobile-friendly than full tabs.

### AI Image mode: Two-step flow

1. **Capture step**: Large camera viewfinder area with "Take Photo" button + "Upload from Gallery" option
2. **Results step**: Shows detected food name, thumbnail, and editable nutritional fields (calories, protein, carbs, fat, fiber, serving size). User can adjust values before confirming.

For now, tapping "Take Photo" or uploading will show a mock result (e.g., "Grilled Chicken Breast, 165 kcal").

### Manual Entry mode: Simple form

Vertical form with fields: Food Name (text), Serving Size (text with unit hint), Calories (number), Protein (number), Carbs (number), Fat (number), Fiber (number). Uses the existing Field/InputGroup component system. Validation via Zod schema.

### Barcode Scanner mode: Camera viewfinder with overlay

Shows a camera viewfinder with a scanning frame overlay. Status text below ("Point camera at barcode"). On successful scan, transitions to a results view similar to AI Image results. Mock: after a simulated delay, show a mock product result.

### Meal category selector: Bottom sheet or inline selector

After nutritional data is ready (from any mode), the user picks a meal category from the four options (Breakfast/Lunch/Dinner/Snacks) displayed as a horizontal row of selectable cards with emoji icons matching the dashboard. This appears as part of the confirmation step.

### Component organization

```
src/components/add/
  mode-selector.tsx        — Segmented control for switching modes
  ai-image-mode.tsx        — Camera/upload + results view
  manual-entry-mode.tsx    — Form for manual food input
  barcode-mode.tsx         — Camera viewfinder + scan results
  meal-category-picker.tsx — Horizontal meal category selector
  nutrition-result.tsx     — Shared editable nutrition display (used by AI + Barcode modes)
```

### State management: Local component state

Use React `useState` for mode selection and form state within the page. No need for Jotai atoms since this is a single-page flow with no cross-page state sharing. React Hook Form for the manual entry form validation.

## Risks / Trade-offs

- **Camera APIs not yet integrated** → Mock the camera UI with placeholder viewfinders and static images. Real camera integration (getUserMedia / expo-camera) is a separate follow-up.
- **No backend persistence** → Confirmation will show a success toast but data won't be saved. This is acceptable for the UI-first approach.
- **Form validation without real nutritional bounds** → Use reasonable ranges (calories 0–5000, macros 0–1000g) that can be tightened later with real data.
- **Three modes increases UI complexity** → Mitigated by keeping each mode self-contained in its own component with a shared result/confirmation step.
