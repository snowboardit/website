# Changelog

## [v1.0.0] - Unreleased

Breaking: new design and a custom theme. Blowfish is gone.

### Added

- Custom Hugo theme in the personal brand system: Barlow, international orange, data-plate layout, dark default
- Vector brand marks (`assets/img/mark-*.svg`), built from the Air America font
- Homepage "Connect" links: LinkedIn, Email, GitHub
- `/c` redirect (302) for the business card QR code, with a one-time welcome line
- Experience page (was Resume), as data (`data/experience.yaml`) rendered as data plates. `/resume` redirects (301) to `/experience/`.
- Footer nameplate with version and a link to the deployed commit
- Animated ASCII background with a warm overlay glow: topo, cumulus, radar, snow, and scope. A small animated ASCII button in the footer cycles them. Long-press jumps to "off", which pauses all motion. Still frame under reduced motion.
- Orange underline that rises into a fill on hover, focus, and tap
- Open Graph image and tags
- Optional Cloudflare Web Analytics (`params.cloudflareAnalyticsToken`)
- `DESIGN.md`

### Changed

- New favicons and app icons from the M mark
- About page avatar framed in the new style. Avatar removed from the homepage.
- Fonts: Montserrat replaced by Barlow (subset woff2)

### Removed

- Blowfish theme (git submodule) and Tailwind markup
- Vanta.js background, three.js, Firebase, jQuery
- Google Analytics
- Site search, RSS, and JSON outputs
- Rotating taglines, replaced by the background switcher
- PNG logos and cached images in `resources/_gen`

## [v0.2.1] - 2026-02-26

### Changed

- Resume layout to be much more readable (and mobile friendly)

### Fixed

- Limit `taglines.js` to run only on the index page

### Removed

- Cached images

## [v0.2.0] - 2026-02-25

### Added

- Dynamic taglines to hero
- Page title

### Changed

- Default headline/tagline
- `mailto` address in hero

### Fixed

- `apple-touch-icon` file resolution

### Removed

- Short bio

## [v0.1.7] - 2025-11-18

### Changed

- Dates to short format (e.g. `Feb`, `Mar`, `Apr`) in Resume page

## [v0.1.6] - 2025-11-18

### Removed

- Redundant "volunteer" mention in Volunteer section of Resume page
- Table of contents from Resume page

## [v0.1.5] - 2025-08-08

### Fixed

- Favicons not showing properly

### Removed

- Avatar image zoom

## [v0.1.4] - 2025-08-07

### Added

- Additional release process instructions

### Changed

- About page bio content

## [v0.1.3] - 2025-04-02

### Added

- Add execute permissions for build and start scripts

### Changed

- Update README
- Update avatar

## [v0.1.2] - 2025-04-02

### Added

- Add start script
- Add setup script
- Add build script

### Changed

- Update theme overrides
- Update blowfish theme
- Update about content
- Update resume

### Removed

- Remove unused asset
- Remove projects
- Remove posts
- Remove pagination (fixes build warning)
- Remove countdown styles

## [v0.1.1] - 2024-11-14

### Added

- Semantic versioning
- Changelog

### Fixed

- Resume formatting

### Changed

- Headline content
- About page content

### Removed

- References to projects page

---

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
