# IOIS PLATFORM — Final Frontend

Upload all files/folders in this directory to the GitHub repository root.

## Pages
- index.html
- membership.html
- news.html
- jobs.html
- chat.html
- panchang.html
- style.css
- script.js
- assets/logo.png (optional; add your actual IOIS logo)

## Notes
This is a static frontend. Weather uses Open-Meteo client-side. Registration demo stores leads in browser localStorage. Do not expose private Telegram/Supabase service keys in frontend code. Use a secure backend/serverless function for private credentials.


## Final Fix Build — 10 Aug 2026
This build consolidates the frontend configuration, fixes authentication configuration mismatch, removes the duplicate registration-page conflict, adds missing privacy/terms/default-avatar assets, and redirects legacy login/registration entry points to the canonical pages. See `FINAL-FIX-AUDIT.txt`.
