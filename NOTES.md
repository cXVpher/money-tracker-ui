## feat:
- Made dashboard sidebar collapsible and scrollable so lower actions stay reachable.
- Added mobile logout action inside the dashboard More menu.
- Added Google OAuth through NextAuth for login and register when `NEXT_PUBLIC_MOCK_DATA=false`.
- Added a light/dark theme toggle to the standalone admin page.
- Added native fetch access/refresh token flow with cookie-first real API auth, 401 refresh retry, and request queueing.
- Added mock auth simulation for testing 401 refresh and queued request plumbing without the real backend.

## fix:
- Removed the user-facing Admin dashboard navigation path by keeping admin access on `/admin` only.
- Reworked admin page colors to use app theme tokens instead of hardcoded light-mode styling.
- Kept real JWT handling bypassed during normal `NEXT_PUBLIC_MOCK_DATA=true` mode so existing mock auth and mock store continue working.
- Stopped generic API responses from storing `token` fields as JWT access tokens, preventing created API tokens from corrupting the session.
- Skipped refresh handling for unauthenticated login/register requests so credential failures surface their original backend errors.

## refactor:
- Added a dashboard shell component to manage sidebar collapsed state.
- Replaced custom dashboard sidebar link markup with a shadcn-style navigation menu wrapper.
- Moved token/session management into `src/features/auth` while keeping `src/shared/_utils/api-client.ts` as the shared fetch wrapper.

## docs:
- Documented secure refresh-token handling expectations for httpOnly cookies in Next.js Server and Client Components.

## style:
- Improved admin page copy, empty states, cards, status badges, and payment/user management presentation for non-technical users.

## chore:
- Installed `next-auth` and updated the lockfile.

## test:

## perf:

## problems:
- Backend Google/OAuth exchange is missing: NextAuth Google login in the UI does not create backend `access_token` / `refresh_token` cookies, so real backend API calls will remain unauthenticated after Google sign-in unless the backend adds an exchange/callback flow.
- Admin token refresh is incomplete: admin login returns `refresh_token`, but the inspected backend has no admin refresh route and does not persist admin refresh tokens, so admin sessions cannot recover automatically after access-token expiry.
- Backend Postman docs appear stale for user login/register: the current handlers set HttpOnly auth cookies and return only `user`, `balance`, and `expires_in`, while the collection still expects `data.access_token` and `data.refresh_token`.
