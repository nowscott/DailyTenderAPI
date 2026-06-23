# Changelog

All notable changes to DailyTenderAPI are documented in this file.

## [0.1.2] - 2026-06-23

### Added

- Added `person1Name`, `person1Birthday`, `person2Name`, and `person2Birthday` as shortcut-friendly alternatives to the nested `people` array.
- Added support for keyed `people.person1` and `people.person2` dictionaries.

## [0.1.1] - 2026-06-23

### Added

- Added `location`, `locationText`, and `address` input support for `POST /api/message`.
- Added city extraction from raw iOS Shortcuts location text, such as `中国\n浙江省\n杭州市 西湖区\n文三路`.

## [0.1.0] - 2026-06-23

### Added

- Added `POST /api/message` for iOS Shortcuts to send date, weather, love start date, and two-person birthday data as JSON.
- Added full message rendering so Shortcuts can send the returned `message` directly.
- Added `GET /api/daily` for structured date and quote data.
- Added Iciba daily quote support with local quote fallback.
- Added Vercel API Routes for `/api/message`, `/api/daily`, and `/api/health`.
- Added unit tests for date calculations, message rendering, quote fallback, and validation.
- Added Vercel deployment and iOS Shortcuts setup guide.
