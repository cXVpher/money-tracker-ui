## feat:
- (auth): add country code dropdown (+62 default) to phone inputs in register and login. added toggle between email/phone login.
- (dashboard): merge user and admin dashboard into a single `/dashboard` route with role-based rendering by decoding JWT in the server.

## fix:
- (auth): resolve refresh token error by rewriting the `Path` attribute of the `user_refresh_token` cookie in proxy `route.ts`.
- (auth): enforce automatic redirection to `/login` if session cookies are missing on the server-side, or if a main backend API data request returns a 401/403 unauthorized response on the client-side.

## refactor:
- (api): split monolithic backend clients into modular service files in `src/services/` and updated all consumers.
- (api): remove `/api` prefix from all frontend service path requests, having the API proxy automatically prepend `/api` when forwarding to the backend.
- (api): consolidate the API proxy into a single global `/api/[...path]/route.ts` handler, removing the confusing `/api/proxy` prefix and complex cookie path rewriting in favor of standard browser-level cookie path matching.
- (admin): remove internal login form and state from `AdminPageContent`, relying entirely on the main JWT cookie to auto-load admin data.

## docs:

## style:
- (dashboard): disable slide and fade page transitions (`framer-motion` PageTransition) when changing paths/menus to provide an instantaneous, native feel.

## chore:

## test:

## perf:

## problems:
