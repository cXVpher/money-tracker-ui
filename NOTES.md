## feat:
- Made dashboard sidebar collapsible and scrollable so lower actions stay reachable.
- Added mobile logout action inside the dashboard More menu.
- Added Google OAuth through NextAuth for login and register when `NEXT_PUBLIC_MOCK_DATA=false`.
- Added a light/dark theme toggle to the standalone admin page.

## fix:
- Removed the user-facing Admin dashboard navigation path by keeping admin access on `/admin` only.
- Reworked admin page colors to use app theme tokens instead of hardcoded light-mode styling.

## refactor:
- Added a dashboard shell component to manage sidebar collapsed state.
- Replaced custom dashboard sidebar link markup with a shadcn-style navigation menu wrapper.

## docs:

## style:
- Improved admin page copy, empty states, cards, status badges, and payment/user management presentation for non-technical users.

## chore:
- Installed `next-auth` and updated the lockfile.

## test:

## perf:
