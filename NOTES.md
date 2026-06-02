## feat:
- **Goals Service**: full CRUD for savings goals: create/edit/delete/contribute with dialog, validations, react-query mutations, loading & error states (`goals-page-content.tsx`)
- **Budget Service**: created `src/services/budget.service.ts` to implement full CRUD operations (GET `/budgets`, POST `/budgets`, PUT `/budgets/:id`, DELETE `/budgets/:id`) with automatic category-to-style metadata mapping.
- **Categories Integration**: connected Settings Categories page (`src/app/dashboard/pengaturan/_components/category-settings-card.tsx`) to `/categories` endpoints for real-time creation, editing, and deletion of custom categories.
- **Budgets Integration**: connected `src/app/dashboard/budget/_components/budget-page-content.tsx` to `/budgets` API. Added an interactive Month picker and built a fully functional Budget Configuration Dialog.
- **Transactions Page Dynamic Options**: updated `src/app/dashboard/transaksi/_components/transactions-page-content.tsx` to load accounts and transaction categories dynamically.
- **Transaction Wallet Linking**: updated `src/features/transactions/_components/transaction-form.tsx` to render a wallet selector and link transactions directly to banking/e-wallet accounts.
- **Sleek Saving Contribution Modal**: replaced legacy browser prompts with a premium, custom Dialog modal for saving contributions, including dynamic "+Rp10k", "+Rp50k", "+Rp100k", "+Rp500k" quick-actions (`goals-page-content.tsx`).
- **Saving-Transaction Orchestration**: automated creation of a custom category ("Kontribusi [nama target]") and dynamic expense transaction logging when savings goal contributions are saved.
- **Goal Deletion Cascade**: implemented automated cascading deletion for all associated savings setoran/contribution expense transactions when a savings target is deleted.
- **Premium Goal Deletion Dialog**: replaced legacy browser confirmations (`window.confirm`) with a beautiful, warning-themed custom Delete Confirmation Dialog modal for cascading deletions.





## fix:
- **Saving Target callbacks**: fixed missing interactive callback props (`onContribute`, `onEdit`, `onDelete`) inside `src/app/dashboard/target/_components/goal-card.tsx`.
- **Form Zod Resolver Type Safety**: resolved React Hook Form & Zod type mismatches in `src/features/transactions/_components/transaction-form.tsx` by migrating to static schema constants and Zod type inference.
- **Null API response fallback**: added safeguarding array fallbacks `(data ?? [])` across API services (`account`, `category`, `budget`, `goal`) to prevent crashes when the user has no custom records yet.


## refactor:
- **Auth**: Extract proxy handler into @/server/auth/proxy; route files are now thin re-exports (handleApiProxy)
- Replace startPeriodicRefresh with startPeriodicAuthRefresh from @/client/auth-refresh in dashboard shell
- **Goal Modals Modularization**: extracted `GoalEditorDialog`, `GoalContributionDialog`, and `GoalDeleteConfirmationDialog` into their own dedicated, type-safe React files under target components folder to simplify `goals-page-content.tsx`.

- Drop getAuthHeaders() from api-client and clearAccessToken() from logout — no longer needed with httpOnly cookie auth
- Delete src/features/auth/_utils/jwt-session.ts (dead code)
- **BudgetCard Actions**: refactored `src/app/dashboard/budget/_components/budget-card.tsx` to render action buttons (Edit, Delete) in the header, mirroring the Account Card style.

## docs:

## style:

## chore:

## test:

## perf:

## problems:
