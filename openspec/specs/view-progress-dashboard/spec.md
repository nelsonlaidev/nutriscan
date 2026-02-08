# Spec: view-progress-dashboard

## Purpose

Provide a unified dashboard for users to view their health progress, including weight, streaks, and calorie intake.

## Requirements

### Requirement: View Weight Summary

The system SHALL display the user's current weight, goal weight, and a progress bar indicating progress towards the goal.

#### Scenario: Default View

- **WHEN** user visits the Progress page
- **THEN** they see the "Your Weight" card with current/goal values and progress bar

### Requirement: View Interaction Streak

The system SHALL display the user's current day streak and a visual indicator of weekly activity (e.g., checks for days logged).

#### Scenario: Active Streak

- **WHEN** user visits the Progress page
- **THEN** they see the "Day Streak" card with the current streak count and flame icon

### Requirement: View Calorie Summary

The system SHALL display the user's daily average calorie intake and a percentage comparison (trend).

#### Scenario: Calorie Stats

- **WHEN** user visits the Progress page
- **THEN** they see the "Daily Average Calories" card with the average value and trend indicator
