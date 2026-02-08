## Why

The `/add` route is a placeholder. Users need a way to log food items to track their nutrition. The page needs three input modes — AI image recognition (snap a photo), manual entry, and barcode scanning — to cover different real-world scenarios and make logging as frictionless as possible.

## What Changes

- Build the Add Food Item page at `(main)/add/` with a tab/mode selector for three input methods
- **AI Image Recognition mode**: camera capture or photo upload, sends image for nutritional analysis, returns editable results
- **Manual Entry mode**: form with food name, serving size, calories, and macronutrient fields
- **Barcode Scanner mode**: camera-based barcode scanning that looks up product nutritional data
- After entry (any mode), user selects a meal category (Breakfast/Lunch/Dinner/Snacks) and confirms
- Confirmation adds the food item to the selected meal for the current day

## Capabilities

### New Capabilities

- `add-food-item`: The add food item page with three input modes (AI image, manual, barcode), meal category selection, and food item confirmation flow

### Modified Capabilities

## Impact

- `src/app/(main)/add/page.tsx` — replace placeholder with full page implementation
- New components under `src/components/add/` for each input mode and shared UI
- New Zod schemas for manual food entry validation
- Future: server actions for AI image analysis and barcode lookup (will use mock/placeholder for now)
- Future: database schema for food items and meal entries (out of scope for this UI-focused change)
