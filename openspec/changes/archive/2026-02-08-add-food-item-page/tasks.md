## 1. Page Shell & Navigation

- [x] 1.1 Create the add food page layout in `src/app/(main)/add/page.tsx` with header (back button + "Add Food" title) and content area
- [x] 1.2 Create `src/components/add/mode-selector.tsx` — segmented control with three modes: AI Scan (Camera icon), Manual (PencilSimple icon), Barcode (Barcode icon)

## 2. AI Image Recognition Mode

- [x] 2.1 Create `src/components/add/ai-image-mode.tsx` — camera viewfinder placeholder with "Take Photo" and "Upload Photo" buttons
- [x] 2.2 Add mock scan logic: tapping either button shows loading state then displays mock nutrition result (Grilled Chicken Breast, 165 kcal)

## 3. Manual Entry Mode

- [x] 3.1 Add Zod validation schema for manual food entry (food name, serving size, calories, protein, carbs, fat, fiber) in `src/lib/zod-schemas.ts`
- [x] 3.2 Create `src/components/add/manual-entry-mode.tsx` — form using Field/InputGroup components with validation

## 4. Barcode Scanner Mode

- [x] 4.1 Create `src/components/add/barcode-mode.tsx` — camera viewfinder with scanning frame overlay, "Point camera at barcode" text, and "Scan" button
- [x] 4.2 Add mock scan logic: tapping "Scan" shows "Scanning..." then displays mock result (Organic Granola Bar, 180 kcal)

## 5. Shared Result & Confirmation Components

- [x] 5.1 Create `src/components/add/nutrition-result.tsx` — editable nutrition result card showing food name, serving, calories, and macros
- [x] 5.2 Create `src/components/add/meal-category-picker.tsx` — horizontal row of four selectable meal category cards (Breakfast/Lunch/Dinner/Snacks) with emoji icons
- [x] 5.3 Wire up "Add to Meal" confirmation: validate category selected, show success toast via Sonner, navigate back to dashboard

## 6. Integration & Polish

- [x] 6.1 Wire all modes together in the page component with state management for mode switching and flow progression (capture → result → meal pick → confirm)
- [x] 6.2 Run `pnpm check` and fix any lint/type/format issues
