## feat:
- Kalender now builds the current month dynamically and defaults the highlighted day to today's local date.
- Added actionable empty states for Akun, Budget, Target, and Transaksi pages.
- Added a loading shell for the Integrasi page while backend modules load.

## fix:

## refactor:
- Added reusable `Skeleton`, `CardGridSkeleton`, and `TableSkeleton` UI helpers.
- Added reusable `EmptyState` UI helper for dashboard empty states.
- Replaced repeated inline loading and empty-state markup across dashboard pages with shared UI helpers.
- Stabilized Budget page derived budget data with `useMemo`.

## docs:

## style:
- Replaced plain loading text with card and table skeleton placeholders.
- Replaced dashed empty-state boxes with centered, actionable empty-state layouts.
- Updated Kalender grid title to use the active month label instead of a hardcoded month.

## chore:

## test:

## perf:

## problems:
