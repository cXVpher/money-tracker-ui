## feat:
- Added field-level register validation with inline messages for name, phone, email, password, and backend validation errors.
- Added a single icon-only dashboard theme toggle that switches between dark and light, with dark as the default.

## fix:
- Hid login mock credential and fallback sections when `NEXT_PUBLIC_MOCK_DATA=false`.
- Removed real-mode fallback paths that logged in, registered, saved, or displayed mock/local data after backend failures.
- Updated the dashboard topbar to read the real backend profile in API mode so avatar initials match the logged-in user.
- Prevented the mock auth gate from reading mock session storage when mock mode is disabled.
- Normalized nullable paginated `items` responses to empty arrays for transactions, integrations, and admin lists to prevent runtime crashes.
- Prevented dashboard sections from seeding local mock data in API mode; sections without connected backend data now render empty states or disabled actions.

## refactor:
- Preserved backend error details in `ApiClientError` so form-level code can map server validation errors to fields.
- Trimmed register payload values before sending them to the backend.
- Updated paginated response typings to allow `items: null` where the backend can return nullable lists.
- Added a shared TanStack Query provider at the app root for client-side server-state caching.
- Refactored the transactions page to load backend transactions with `useQuery` instead of manual `useEffect` state.
- Refactored backend transaction detail and delete flows to use `useMutation`.
- Added optimistic transaction removal with rollback when backend deletion fails.
- Updated newly created backend transactions into the query cache before invalidating for fresh server data.
- Kept mock transaction data handling separate from backend query state.

## docs:

## style:
- Reworded dashboard empty states, notices, dialogs, and toasts to avoid exposing technical terms like mock, API, backend, or endpoint to users.

## chore:

## test:

## perf:

## problems:
- Akun, budget, target, hutang, calendar, export, notification, and category settings still need real backend endpoints before they can be fully usable with `NEXT_PUBLIC_MOCK_DATA=false`.
