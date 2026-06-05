## feat:
- **Admin Backend Integration**: connected admin authentication through the existing `/login` flow, then let `/dashboard` read user/admin cookies server-side to route to the correct user or admin panel.

## fix:
- **Category Select Icons**: preserved backend category emoji icons as `displayIcon` and used them in transaction and budget category dropdown options instead of rendering internal icon keys like `food`.
- **Account Initial Balance Input**: changed the add-account initial balance field to start empty instead of defaulting to `0`, preventing leading zero values while still submitting empty input as zero.
- **Budget Limit Input**: changed the new budget limit field to start empty instead of defaulting to `0`, preventing leading zero values when entering monthly limits.
- **Profile Edit Mode**: made profile fields read-only by default and only show the save button after the pencil edit button is activated.
- **Collapsed Sidebar Header**: kept the logo centered when the sidebar is collapsed by positioning the collapse toggle without affecting logo alignment.
- **Transaction Category Icons**: rendered transaction category icons with `AppIcon` in transaction tables instead of showing internal icon keys like `food` or `other`.

## refactor:
- **API Proxy Organization**: moved shared proxy logic from `src/server/auth/proxy.ts` to `src/server/api/proxy.ts`, updated route imports, and removed the unused `handleProxy` export from the catch-all API route.
- **Server API Runtime Config**: moved backend `API_BASE_URL` resolution into server-only `src/server/api/runtime.ts`, leaving client code to use the frontend `/api` proxy via `FRONTEND_API_BASE_URL`.
- **Shared Domain Types**: split `src/shared/_types/finance.ts` into domain-specific files for account, transaction, budget, goal, debt, and bill, with a shared barrel export for multi-type imports.

## docs:
- **Environment Configuration**: updated `README.md` to use server-only `API_BASE_URL` for the Go backend and clarify that browser requests still go through the frontend `/api` proxy.

## style:
- **Transaction Detail Dialog**: redesigned the transaction detail modal into a more scannable summary with a highlighted category header, formatted amount, transaction type badge, and compact metadata cards.
- **Goal Icon Picker**: replaced the target icon text dropdown with an icon-only visual picker so users choose from the available icons directly.
- **Category Icon Picker**: replaced the settings category icon text dropdown with a compact icon-only grid picker inspired by emoji panels.

## chore:

## test:

## perf:

## problems:
