# Changelog

All notable changes to DailyTenderAPI are documented in this file.

## [0.2.3] - 2026-06-24

### Fixed

- Return 400 responses for non-object `POST /api/message` JSON bodies instead of internal errors.
- Return 400 responses for invalid `timeZone` values on message and daily endpoints.
- Sync homepage, health response, and package metadata to the current release version.
- Remove the stale version callout from the README.

### Changed

- Serve the Iciba quote endpoint over HTTPS and cache successful remote daily quotes in-process.
- Use `temperature` as the message template fallback when `feelsLike` is omitted.
- Improve city extraction for compact province-city-district location text.

## [0.2.2] - 2026-06-24

### Changed

- Refined the request JSON editor styling with stable sizing, padding, focus state, and mobile wrapping.

## [0.2.1] - 2026-06-24

### Changed

- Replaced homepage and README examples with fictional sample data.
- Improved the mobile request JSON editor sizing and wrapping behavior.
- Generalized historical changelog sample data that contained a real-looking address.

## [0.2.0] - 2026-06-24

### Added

- Added a Bootstrap-based landing page at `/` for API usage guidance.
- Added an in-page live API tester for `POST /api/message`.
- Added copy buttons for the endpoint, generated message, and curl example.
- Added responsive shortcut setup, field reference, and message preview sections.

## [0.1.3] - 2026-06-23

### Changed

- Changed `POST /api/message` output to a send-ready morning message template with emoji labels.
- Changed default love-day counting to the date-difference rule used by AutoCare and the iOS Shortcut message example.
- Changed quote order in the final message to English first, Chinese second.

### Added

- Added `greetingName`, `greetingText`, `closingText`, and `emojis` inputs for message customization.
- Added per-person `emoji` support for birthday countdown lines.
- Added automatic `%` suffix formatting for numeric `rainProbability`.
- Added request JSON key trimming to tolerate accidental trailing spaces in iOS Shortcut dictionary keys.

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
