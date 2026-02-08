# Proposal: Progress Dashboard

## Goal

Create a comprehensive "Progress" dashboard page that allows users to track their health metrics, specifically weight, streaks, and calorie intake. This page will serve as a central hub for visualizing progress over time.

## What Changes

We will implement a new "Progress" page accessible from the main navigation. This page will feature:

- A "Current Weight" card with a progress bar towards the goal and a "Log Weight" button.
- A "Day Streak" card visualizing the current streak and weekly activity.
- A "Weight Progress" chart (Line Chart) showing weight history with time range filters (90D, 6M, 1Y, ALL).
- A "Daily Average Calories" card showing calorie consumption trends.
- Use of Shadcn UI components and Recharts for data visualization.
- Mock data will be used for the initial implementation.

## Capabilities

### New Capabilities

- `view-progress-dashboard`: View the main progress dashboard with weight, streak, and calorie summaries.
- `log-weight`: Interface/modal to log a new weight entry.
- `view-weight-history`: Interactive chart to view weight history over different time ranges.

## Impact

- **Frontend**: New page route `/progress`. New components in `src/components/progress/`.
- **Dependencies**: `recharts` (visualization), `shadcn/ui` (components).
