## Why

The profile page currently only shows a user avatar and name with a placeholder settings button. Users need a complete profile view displaying their personal details, health metrics, and account information to feel oriented in the app and manage their data.

## What Changes

- Expand the profile page to display user avatar (large), full name, and email
- Add a health metrics section showing current weight, goal weight, and height
- Add an account info section showing member-since date
- Add a sign-out button
- Use mock data for any fields not yet populated (e.g., missing avatar, weight, height)

## Capabilities

### New Capabilities

- `profile-view`: Displays user profile with avatar, personal info, health metrics, and account actions (sign out)

### Modified Capabilities

<!-- None — this builds on the existing skeleton page -->

## Impact

- **Code**: Modifies `src/app/(main)/profile/page.tsx` — replaces current minimal implementation
- **Components**: May use existing Avatar, Button, Separator components
- **Auth**: Uses existing `useSession()` hook and `authClient.signOut()` for sign-out
- **Dependencies**: No new dependencies required
