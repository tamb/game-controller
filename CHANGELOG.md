# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-08-30

### Added

- MIT `LICENSE` file and this changelog.
- Dual package entries: `@tamb/gamecontroller` registers custom elements; `@tamb/gamecontroller/react` does not.
- Typed `GameControllerHooks` and union props (`actions`, `leftControl`, `scale`, `size`).
- Press **released** events (`gcdpad:up:released`, `gcface:a:released`, `gamecontroller:dpad:up:released`, …).
- `repeat: boolean` on press event `detail`.
- D-pad hold-to-repeat (`repeat-delay` 400ms, `repeat-interval` 80ms; `repeat="false"` to disable).
- `installGameControllerKeyboard` and a `keyboard` attribute on `<game-controller>` (default on).
- Playwright Chromium + WebKit smoke tests.

### Changed

- Custom element `customElements.define` moved to `src/register.ts` (main entry only).
- TypeScript `strict` mode.
- `react` and `react-dom` remain required peers for HTML custom-element usage (`@r2wc/core` + `createRoot`).

## [1.0.0-alpha.2] - 2026-08-30

Pre-release of the React + `@r2wc/core` custom-element rewrite (usable-screen layout, joystick, theming, Storybook demo).
