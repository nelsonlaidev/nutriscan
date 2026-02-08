## Context

The application requires a settings page to allow users to manage their experience. Currently, there is no UI for changing themes or viewing account details centrally. We will use the existing `next-themes` for dark mode and `better-auth` for authentication management.

## Goals / Non-Goals

**Goals:**

- Create a responsive `/settings` page.
- Implement Dark Mode toggle using `next-themes`.
- Display User Profile information (read-only for now, or simple edit if easy).
- Implement Sign Out using `better-auth`.
- specific UI for Language selection (even if backend support is pending).

**Non-Goals:**

- Full i18n implementation (just the UI selector for now).
- Complex account deletion flows (unless simple to add).

## Decisions

### Architecture

- **Route**: `/settings` (protected route).
- **Layout**: Simple single-column layout with grouped sections (Account, Preferences).

### Libraries & Tools

- **Icons**: Use `@phosphor-icons/react` to match existing style.
- **Theme**: `next-themes` `useTheme` hook.
- **Auth**: `better-auth` `useSession` and `signOut` methods.
- **Components**: Reuse existing UI components from `src/components/ui` or create new ones using Tailwind CSS if missing.

### State Management

- **Theme**: Persisted by `next-themes` (local storage).
- **Language**: Local state (or cookie) for now.

## Risks / Trade-offs

- **Risk**: Language setting might not do anything yet.
- **Mitigation**: Label it clearly or implement a basic Context provider if needed.
