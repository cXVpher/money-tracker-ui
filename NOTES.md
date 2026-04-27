## feat:
- added a client-side mock persistence layer in `src/shared/_utils/mock-client-store.ts` for accounts, budgets, debts, goals, transactions, profile settings, notification settings, category settings, and export payloads while the API is still in progress
- wired settings screens to real local state so profile, notifications, theme preference, category management, and export actions now behave like working product flows instead of static preview UI
- wired create dialogs for accounts, budgets, debts, goals, and transactions to save locally with validation and immediate UI updates
- updated dashboard, analytics, transactions, and calendar screens to read merged mock plus locally-created data so user-entered mock records appear consistently across the app

## fix:
- restored missing mobile access to non-primary dashboard routes by adding a `More` sheet to the mobile navigation
- implemented selected-day behavior on the calendar page so the details panel reflects the clicked date instead of a hardcoded transaction slice
- connected theme settings to `next-themes` so changing the selected theme actually updates the app theme
- fixed the transaction dialog cancel action so it closes the dialog correctly
- removed `.next/dev/types` from TypeScript inputs to prevent stale generated files from breaking local typechecking
- corrected the app metadata title encoding and cleaned broken mojibake icon/text data in mock/category sources

## refactor:
- renamed vague files, exports, and component names to domain-specific names across dashboard, analytics, landing, and shared modules
- replaced several generic variables and props with clearer domain names, especially around dashboard summary data, transaction filtering, calendar day summaries, and analytics metric structures
- widened category config typing so category settings can be edited safely without being constrained to exact literal default values

## docs:
- updated `README.md` to document the pnpm-based workflow, project run commands, the current build caveat around `next/font/google`, and the correct app entry path
- updated local project notes in `TO-DO.md` to reflect pnpm commands

## chore:
- migrated the project from npm to pnpm by adding `packageManager` metadata, generating `pnpm-lock.yaml`, and removing `package-lock.json`
