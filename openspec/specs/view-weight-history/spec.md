# Spec: view-weight-history

## Purpose

Visualize user weight changes over time to provide insights into their progress.

## Requirements

### Requirement: Weight History Chart

The system SHALL display a line chart visualizing the user's weight history over time.

#### Scenario: Chart Rendering

- **WHEN** user views the Progress page
- **THEN** a line chart is rendered showing date (x-axis) vs weight (y-axis)

### Requirement: Time Range Selection

The system SHALL allow users to toggle the chart time range between 90D, 6M, 1Y, and ALL.

#### Scenario: Switch Range

- **WHEN** user clicks "6M" toggle
- **THEN** the chart updates to show data from the last 6 months

### Requirement: Chart Interaction

The system SHALL display details (date, weight) when hovering over data points on the chart.

#### Scenario: Hover Data

- **WHEN** user hovers over the chart line
- **THEN** a tooltip appears showing the specific weight and date for that point
