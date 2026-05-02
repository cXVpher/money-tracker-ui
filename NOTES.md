## feat:
- Wired frontend authentication/profile flows to the Go backend API with mock fallback support.
- Wired dashboard summary, chart, report, transaction list/detail/create/delete, balance, payments, tokens, groups, referrals, and admin API clients.
- Added integration dashboard UI for payments, API tokens, groups, group reports, and referral management.
- Added admin UI with admin login, dashboard stats, user list/detail/actions, payment verification/rejection, revenue, referrals, logs, backend-compatible user filters/sorting/pagination, and mock admin data while the API is inactive.
- Moved admin access to the standalone `/admin` route so it is reachable only by directly entering the admin URL.

## fix:
- Replaced all visible emoji/emoticon UI markers with Phosphor icon components.
- Removed the Admin entry from the user dashboard navigation so admin access is not available from user-facing pages.
- Replaced a malformed separator character in the admin user list with an ASCII separator.

## refactor:
- Added a shared Phosphor icon compatibility module for existing icon imports and app icon mapping.
- Moved admin page files out of the dashboard route tree into `src/app/admin`.

## docs:

## chore:
- Installed and configured `@phosphor-icons/react`.