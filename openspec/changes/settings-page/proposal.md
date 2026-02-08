## Why

Users need a dedicated interface to manage their application preferences and account details. Currently, there is no centralized location to change application language, toggle dark mode, or manage personal information efficiently.

## What Changes

- Create a new **Settings Page**.
- Add sections for:
  - **Personal Information**: View/Edit user details.
  - **Language**: Selector for application language.
  - **Dark Mode**: Toggle for theme preference.
  - **Sign Out**: specific action to end the session.
- Ensure all items use appropriate icons for visual clarity.

## Capabilities

### New Capabilities

- `user-settings`: Manages application preferences (Language, Theme) and provides access to account management actions (Sign Out, Personal Info).

### Modified Capabilities

<!-- No existing spec changes required for this specific addition, assuming purely additive. -->

## Impact

- **UI**: New `/settings` route and page.
- **State**: Persisting theme and language preferences (local storage or DB).
- **Auth**: Re-using existing sign-out logic but exposing it in the new settings UI.
