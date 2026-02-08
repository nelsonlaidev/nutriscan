## Context

The profile page at `src/app/(main)/profile/page.tsx` currently renders a minimal layout: an avatar, a page title, and a settings gear button. The user schema already stores `name`, `email`, `image`, `currentWeight`, `goalWeight`, `height`, and `createdAt`. The page uses the `useSession()` client hook to access user data.

## Goals / Non-Goals

**Goals:**

- Display a complete profile view with avatar, name, email, health metrics, and account info
- Provide a sign-out action
- Use mock/fallback data when real data is unavailable

**Non-Goals:**

- Profile editing (future work)
- Settings page behind the gear icon (future work)
- Image upload or avatar change

## Decisions

### 1. Single-page client component

Keep the existing `'use client'` pattern with `useSession()`. No need for server component or additional data fetching since all profile data is already in the session.

**Why**: Session already contains all needed fields. Adding a server fetch would add complexity for no benefit.

### 2. Section-based layout

Organize the page into distinct visual sections using existing `Separator` component:

- **Header**: Large avatar + name + email
- **Health Metrics**: Current weight, goal weight, height displayed as a grid of stat cards
- **Account**: Member since date + sign-out button

**Why**: Clear visual hierarchy, easy to extend later with more sections.

### 3. Mock data strategy

Use inline fallback values directly in the component:

- Avatar: show `UserCircleIcon` (existing pattern)
- Weight/height: show "Not set" when null
- Name: use email prefix as fallback

**Why**: Simple, no mock data file needed. Easy to remove once real data flows in.

### 4. Sign-out via `authClient.signOut()`

Use the existing better-auth client `signOut()` method with redirect to `/auth/sign-in`.

**Why**: Already available, no new API needed.

## Risks / Trade-offs

- **Session data staleness** → Acceptable for now; profile editing will need cache invalidation later
- **No loading state for sign-out** → Low risk; add loading spinner on the button during sign-out to prevent double-clicks
