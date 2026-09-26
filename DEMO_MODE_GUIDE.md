Subject: How to make a frontend-only demo (no backend needed)

Team, for client demos where we don't want to spin up a backend/DB, here's the pattern we used on the EEC project — reuse it for other apps too:

1. Fake login — skip the real login API call. Accept any username/password, add a role dropdown if the app has multiple user types, generate a fake token locally (matching whatever format the app's route guards expect), and redirect to the right dashboard.

2. Fake data, in one place — don't touch every screen. Patch window.fetch once at app startup to intercept any /api/... call and return canned JSON instead of hitting the network. Give rich fixtures to the main dashboard of each portal (what the client sees first), and a generic { success: true, data: [] } fallback for everything else so nothing crashes.

3. Verify — run the build, then actually click through each login/dashboard once. Don't assume it works just because it compiles.

Reference implementation: src/utils/demoAuth.js (fake login) and src/utils/mockApi.js (fake data), in the EEC demo repo. Ping me if you want a walkthrough.
