## feat:
- Implemented a Next.js generic proxy route (`src/app/api/proxy/[...path]/route.ts`) to intercept backend API calls and manage JWT tokens securely using `httpOnly` cookies.
- Set up automated token extraction and HTTP Cookie headers for authentication endpoints (`login`, `register`, `refresh`, `logout`).
- Re-routed frontend API clients (`api-client.ts`, `backend-admin-client.ts`) to communicate exclusively through the new Next.js BFF proxy to prevent direct exposure of JWTs.

## fix:
- Fixed a scoping issue in `mobile-nav.tsx` where the `error` variable was inaccessible in the catch block for logout handling.
- Fixed TypeScript errors in `admin-page-content.tsx` and `integrations-page-content.tsx` caused by residual mock logic.
- Fixed login failure caused by a cookie name mismatch in the BFF proxy: the proxy was creating cookies named `access_token`/`refresh_token`, while the backend reads and writes cookies named `user_access_token`/`user_refresh_token`. The proxy now forwards the backend's `Set-Cookie` headers directly to the browser and also forwards all existing cookies in outgoing requests.

## refactor:
- Removed the `USE_MOCK_DATA` environment variable and fallback logic entirely from the codebase.
- Deleted local mock stores and static mock data files (`mock-client-store.ts`, `mock-admin-client.ts`, `mock-data.ts`, `dashboard-summary.ts`).
- Updated core API clients (`api-client.ts`, `backend-admin-client.ts`) to strictly communicate with real backend endpoints.
- Replaced local mock data mutations in dialog components (`account-dialog`, `budget-dialog`, `debt-dialog`, `goal-dialog`) and settings cards (`profile-settings`, `category-settings`) with graceful toast error messages to disable unsupported operations.
- Cleaned up obsolete JWT helper functions (`getAccessToken`, `setAccessToken`, `refreshAuth`) as they are no longer needed after the `httpOnly` cookie migration.
- Made `apiFetch` private to fix dead-code export warnings.
## docs:

## style:

## chore:
- Cleaned up the codebase by deleting orphaned route components (`account-dialog`, `budget-dialog`, `debt-dialog`, `goal-dialog`) from `src/app/dashboard/` and removing the unused `src/features/auth/index.ts`.

## test:

## perf:

## problems:
