# Changelog

All notable changes to DailyTenderAPI are documented in this file.

## [0.1.0] - 2026-06-23

### Added

- Added `POST /api/message` for iOS Shortcuts to send date, weather, love start date, and two-person birthday data as JSON.
- Added full message rendering so Shortcuts can send the returned `message` directly.
- Added `GET /api/daily` for structured date and quote data.
- Added Iciba daily quote support with local quote fallback.
- Added Vercel API Routes for `/api/message`, `/api/daily`, and `/api/health`.
- Added unit tests for date calculations, message rendering, quote fallback, and validation.
- Added Vercel deployment and iOS Shortcuts setup guide.
