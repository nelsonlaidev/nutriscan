# Design: Progress Dashboard

## Context

The user wants a "Progress" dashboard to track weight, streaks, and calories. The current application structure matches a Next.js App Router project. We need to introduce a new top-level page and associated components.

## Goals / Non-Goals

**Goals:**

- Implement `/progress` page matching the provided visual reference.
- Create reusable components for the dashboard cards.
- Integrate `recharts` for the weight history graph.
- Use `shadcn/ui` components for consistency.
- Use mock data for immediate visualization.

**Non-Goals:**

- Real backend integration (Mock data only).
- strict pixel-perfect replication (aim for "something like" the image, high quality).

## Decisions

### Architecture

- **Page**: `src/app/progress/page.tsx`
- **Components**: `src/components/progress/`
  - `weight-card.tsx`: Displays current weight, goal, progress bar.
  - `streak-card.tsx`: Displays streak count and weekly indicators.
  - `weight-chart.tsx`: Handles the Recharts line graph and time range toggles.
  - `calories-card.tsx`: Displays daily average calories.
  - `progress-dashboard.tsx`: Main container to layout these components.
- **Navigation**: We will assume a bottom navigation pattern is desired based on the image (Home, Progress, Groups, Profile). We will implement a `BottomNav` component if one doesn't exist or integrate into the existing layout.

### Data

- We will create `src/lib/mock/progress-data.ts` to export typed mock data for all widgets.

### Libraries

- `recharts`: For the line chart.
- `@phosphor-icons/react` (already installed): For icons (Flame, Home, ChartBar, Users, User, Plus).
- `date-fns` (if needed for date formatting).

## Risks / Trade-offs

- **Recharts**: Responsive behavior on mobile needs care.
- **Navigation**: Modifying the global layout to add a bottom bar might affect other pages. We will ensure it's conditionally rendered or responsive.
