## ADDED Requirements

### Requirement: Display Personal Information

The settings page SHALL display the authenticated user's name and email.

#### Scenario: User details available

- **WHEN** the user visits the settings page
- **THEN** the system displays the user's name and email address from the session

### Requirement: Toggle Dark Mode

The settings page SHALL allow the user to toggle between light and dark themes.

#### Scenario: Switch to Dark Mode

- **WHEN** the user selects "Dark" or toggles the theme switch on
- **THEN** the application theme updates to dark mode immediately

#### Scenario: Switch to Light Mode

- **WHEN** the user selects "Light" or toggles the theme switch off
- **THEN** the application theme updates to light mode immediately

### Requirement: Select Language

The settings page SHALL allow the user to select their preferred language.

#### Scenario: Change Language

- **WHEN** the user selects a different language from the dropdown
- **THEN** the system updates the selected language preference

### Requirement: Sign Out

The settings page SHALL provide a mechanism to sign out of the application.

#### Scenario: User clicks Sign Out

- **WHEN** the user clicks the "Sign Out" button
- **THEN** the system terminates the session and redirects to the sign-in page
