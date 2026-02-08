## ADDED Requirements

### Requirement: Display user avatar

The profile page SHALL display the user's avatar image at a prominent size. If no avatar image is available, the system SHALL display a fallback icon.

#### Scenario: User has avatar image

- **WHEN** user has an `image` URL in their session
- **THEN** system displays the avatar image with initials fallback

#### Scenario: User has no avatar image

- **WHEN** user has no `image` URL in their session
- **THEN** system displays a large UserCircleIcon as placeholder

### Requirement: Display personal information

The profile page SHALL display the user's name and email address below the avatar.

#### Scenario: User has name set

- **WHEN** user has a `name` in their session
- **THEN** system displays the name

#### Scenario: User has no name

- **WHEN** user has no `name` in their session
- **THEN** system displays the email prefix as fallback

### Requirement: Display health metrics

The profile page SHALL display a section with current weight, goal weight, and height.

#### Scenario: Health data is populated

- **WHEN** user has `currentWeight`, `goalWeight`, and `height` values
- **THEN** system displays each metric with its value and unit (kg for weight, cm for height)

#### Scenario: Health data is missing

- **WHEN** any health metric is null
- **THEN** system displays "Not set" for that metric

### Requirement: Display account information

The profile page SHALL display the user's account creation date.

#### Scenario: Account date shown

- **WHEN** user views the profile page
- **THEN** system displays a "Member since" label with a formatted date

### Requirement: Sign out action

The profile page SHALL provide a sign-out button that logs the user out and redirects to the sign-in page.

#### Scenario: User signs out

- **WHEN** user taps the sign-out button
- **THEN** system calls `authClient.signOut()` and redirects to `/auth/sign-in`

#### Scenario: Sign out in progress

- **WHEN** sign-out is in progress
- **THEN** the button SHALL show a loading state to prevent double-clicks
