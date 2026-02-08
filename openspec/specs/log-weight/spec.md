# Spec: log-weight

## Purpose

Allow users to record their weight to track progress over time.

## Requirements

### Requirement: Log Weight Interface

The system SHALL provide a mechanism to allow users to log their current weight.

#### Scenario: Open Log Weight

- **WHEN** user clicks "Log Weight" button on the Weight Card
- **THEN** a modal or input form appears to enter weight

#### Scenario: Save Weight

- **WHEN** user submits a valid weight
- **THEN** the weight is recorded (mocked) and the dashboard updates to reflect the new weight
