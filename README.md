# @tamb/gamecontroller

A Lit-based Web Component: a Gameboy-style virtual controller skin. Styles are plain CSS (with variables on `:host`) inside the shadow root.

## Installation

```bash
npm install @tamb/gamecontroller lit
```

`lit` is a peer dependency—install it alongside this package.

## Usage

Register the element once (side effect of the main entry):

```ts
import "@tamb/gamecontroller";
```

Place it in HTML or create it in JavaScript:

```html
<game-controller actions="4"></game-controller>
```

```ts
import "@tamb/gamecontroller";
import type { GameControllerElement } from "@tamb/gamecontroller";

const el = document.createElement("game-controller") as GameControllerElement;
el.actions = 2;
el.vibrate = true;
el.hooks = {
  a(controller) {
    console.log("A pressed", controller);
  },
};
document.body.appendChild(el);
```

### Layout and fullscreen

`<game-controller>` stretches to at least **`100dvh`** tall and **full width**, with **`env(safe-area-inset-*)`** padding on the inner shell so controls stay off notches and home bars when the page uses **`viewport-fit=cover`**:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

The **fullscreen** control calls **`this.requestFullscreen()`** on the element (not `<html>`), so **`:host(:fullscreen)`** fills the screen when the API succeeds. Escape exits fullscreen and keeps the layout in sync.

The shell switches layout with **`@media (orientation: landscape)`**. **Portrait:** **screen column** (stage then ancillary), then a **row** of d-pad/joystick and face buttons. **Landscape:** flexbox **`order`** plus **`display: contents`** on the hands strip yields **stick | screen column | face buttons** left to right. Set **`left-control="joystick"`** on `<game-controller>` to swap the d-pad for `<gc-joystick>` (events remain **`gcjoystick:*`**).

Embedded hosts with a fixed height should set **`--gc-host-min-height: 100%`** and **`--gc-host-height: 100%`** on an ancestor (and give that chain a definite height) so `:host` does not insist on **`100dvh`** and overflow the panel.

### Events

All interaction events bubble and are composed (usable from outside shadow DOM). Each `detail` includes `controller`, the host element.

Use the exported **`EVENTS`** object so listeners stay in sync with what the elements dispatch (for example `EVENTS.gameController.action.a`, `EVENTS.gcJoystick.move`). Per-hour clock events are built with **`gcJoystickClockHourEvent(n)`** (`n` is 1–12). For Storybook, **`SB_GAME_CONTROLLER_EVENTS`**, **`SB_GC_DPAD_EVENTS`**, and **`SB_GC_JOYSTICK_EVENTS`** are flat arrays derived from the same definitions.

```ts
import { EVENTS } from "@tamb/gamecontroller";

el.addEventListener(EVENTS.gameController.dpad.up, (e) => {
  console.log((e as CustomEvent).detail);
});
```

| Event |
| --- |
| `gamecontroller:ancillary:fullscreen` |
| `gamecontroller:ancillary:select` |
| `gamecontroller:ancillary:start` |
| `gamecontroller:dpad:up` `gamecontroller:dpad:right` `gamecontroller:dpad:down` `gamecontroller:dpad:left` |
| `gamecontroller:action:a` `gamecontroller:action:b` (two-button layout) |
| `gamecontroller:action:y` `gamecontroller:action:x` `gamecontroller:action:b` `gamecontroller:action:a` (four-button layout) |

`<game-controller>` embeds **`<gc-dpad>`**, **`<gc-ancillary-buttons>`**, and **`<gc-face-buttons>`**; d-pad / ancillary / face events also surface as the `gamecontroller:*` names below when handled by the shell.

#### `<gc-ancillary-buttons>` (standalone)

Row buttons emit **`gcancillary:fullscreen`**, **`gcancillary:select`**, **`gcancillary:start`** with `detail: { controller, id }`. Theme with **`--gc-ancillary-*`** on the host (same tokens as inside `<game-controller>`).

#### `<gc-face-buttons>` (standalone)

**`actions`** (`2` or `4`) sets the diamond vs pair layout. Emits **`gcface:a`** … **`gcface:y`** with `detail: { controller, button }`. Theme with **`--gc-action-*`** on the host.

#### `<gc-dpad>` (standalone)

Direction clicks emit **`gcdpad:up`**, **`gcdpad:down`**, **`gcdpad:left`**, **`gcdpad:right`** with `detail: { controller, direction }`. Inherits **`--gc-dpad-*`** variables from ancestors.

#### `<gc-joystick>` (standalone)

Pointer-drag joystick; knob snaps back on release.

**Always:** **`gcjoystick:pointerdown`** once when the user grabs the knob (detail: **`controller`**). **`gcjoystick:move`** — `detail` includes `controller`, normalized **`x`** / **`y`**, **`magnitude`** (0…1), **`angleDeg`** / **`angleRad`** (clockwise from **up**: 0° = up, 90° = right, …; `null` in dead zone), derived **`sectorId`**, **`cardinal`** (`up` \| `right` \| `down` \| `left` \| `none`), **`clockHour`** (1–12 with 12 at top), **`clockLabel`** (e.g. `6-oclock`).

**Optional edge events** (all default off):

| Attribute | Events |
| --- | --- |
| **`emit-cardinal`** | **`gcjoystick:cardinal:up`** … **`gcjoystick:cardinal:none`** — detail includes full snapshot + **`previousCardinal`**. |
| **`emit-sectors`** | **`gcjoystick:sector`** when **`sectorId`** changes — **`previousSectorId`**. |
| **`emit-clock`** | **`gcjoystick:clock`** when hour changes + **`gcjoystick:clock:{1–12}`** — **`previousHour`** / **`previousLabel`**. |

Also: **`dead-zone`** (default `0.12`), **`sectors-json`** (`[{ id, startDeg, endDeg }]`), or set **`sectors`** from JS. Default sectors are eight 45° compass wedges (`n`, `ne`, …). Theme with **`--gc-joystick-*`** on the host.

### API (`GameControllerElement`)

- **`actions`**: `2` | `4` — number of face buttons (attribute `actions`, reflected).
- **`vibrate`**: haptics via `navigator.vibrate` on taps, d-pad, ancillaries, and joystick grab where supported (default `true`). Toggle off in JS with `el.vibrate = false` or in HTML with **`vibrate="false"`** (also `0` or `off`).
- **`leftControl`**: `"dpad"` (default) or `"joystick"` — attribute **`left-control`** swaps `<gc-dpad>` for `<gc-joystick>` (listen for **`gcjoystick:*`**; no automatic **`gamecontroller:dpad:*`** mapping).
- **`hooks`**: optional `Record<string, (controller) => void>` keyed by control name (`select`, `start`, `a`, …); not an HTML attribute.

### Theming (`--gc-*` CSS variables)

Set custom properties on `<game-controller>`. They apply on `:host` and drive colors, borders, and sizing inside the shadow tree. **Built-in defaults are neutral monochrome**: black text and outlines, white shell and face buttons, transparent stage / ancillary / d-pad fills unless you override them. `<gc-dpad>` and `<gc-joystick>` use the same idea when used alone.

`<gc-joystick>` defaults: transparent ring with a black circle stroke, white knob with black border, no drop shadow.

**Shell**

| Variable | Role |
| --- | --- |
| `--gc-shell-bg` | Outer layout background (“device body”) |
| `--gc-shell-border-width` / `--gc-shell-border-style` / `--gc-shell-border-color` | Shell outline pieces |
| `--gc-shell-border` | Shorthand (defaults compose from the three parts above) |
| `--gc-main-controls-bg` | Strip behind d-pad + face buttons (`transparent` by default) |

**Stage (screen)**

| Variable | Role |
| --- | --- |
| `--gc-stage-bg` | Stage fill |
| `--gc-stage-border-width` / `--gc-stage-border-style` / `--gc-stage-border-color` | Stage frame pieces |
| `--gc-stage-border` | Shorthand |

**Face buttons (A/B or Y/X/B/A)**

| Variable | Role |
| --- | --- |
| `--gc-action-size` | Diameter |
| `--gc-action-btn-bg` / `--gc-action-btn-color` | Default fill & label |
| `--gc-action-btn-border-width` / `-style` / `-color` | Default border pieces |
| `--gc-action-btn-border` | Default border shorthand |
| `--gc-action-btn-border-radius` | Usually `50%` |
| `--gc-action-btn-{1–4}-bg` / `-color` / `-border` | Optional per-button overrides |

**D-pad**

| Variable | Role |
| --- | --- |
| `--gc-dpad-axis` / `--gc-dpad-half` | Arm lengths in portrait; in **`orientation: landscape`**, `:host` maps axis from **`--gc-dpad-axis-landscape`** / **`--gc-dpad-half-landscape`** |
| `--gc-dpad-btn-bg` / `--gc-dpad-btn-color` | Shared pad styling |
| `--gc-dpad-btn-border-*` / `--gc-dpad-btn-border` | Border tokens |
| `--gc-dpad-btn-border-radius` | Corner radius |
| `--gc-dpad-btn-{up,right,down,left}-bg` / `-color` / `-border` | Optional per-direction overrides |

**Joystick (`<gc-joystick>` only)**

| Variable | Role |
| --- | --- |
| `--gc-joystick-ring-bg` | Disc behind knob |
| `--gc-joystick-ring-border` | Ring outline |
| `--gc-joystick-knob-bg` / `--gc-joystick-knob-border` | Knob |
| `--gc-joystick-knob-size` | Knob diameter |

**Ancillary row** (fullscreen / select / start)

| Variable | Role |
| --- | --- |
| `--gc-ancillary-btn-bg` / `--gc-ancillary-btn-color` | Fill & text |
| `--gc-ancillary-btn-border-*` / `--gc-ancillary-btn-border` | Border |
| `--gc-ancillary-btn-border-radius` | Corners |
| `--gc-ancillary-margin` / `--gc-ancillary-padding` | Spacing |

**Other**

| Variable | Role |
| --- | --- |
| `--gc-color-text` | Default text / `currentColor` baseline |
| `--gc-font-family` | Typography |
| `--gc-action-font-size` / `--gc-ancillary-font-size` | Button labels |
| `--gc-focus-ring-*` / `--gc-focus-ring` | `:focus-visible` outline |

Example (optional palette on top of the neutral defaults):

```css
game-controller {
  --gc-shell-bg: #0f0f0f;
  --gc-color-text: #fafafa;
  --gc-stage-bg: #1a1a1a;
  --gc-stage-border-color: #fafafa;
  --gc-action-btn-bg: #2a2a2a;
  --gc-action-btn-color: #fafafa;
  --gc-action-btn-border-color: #fafafa;
}
```

This replaces the previous imperative `GameController` class and `@tamb/utils` DOM helper.

## Development

Run [Storybook](https://storybook.js.org/) v10 (component playground):

```bash
npm install
npm run storybook
```

Stories under **Game controller**, **GC / D-pad**, and **GC / Joystick** include an **`sb-event-log`** panel that prints bubbling custom events (JSON `detail`, with `controller` shown as a tag name). Use **Fill viewport (no event log)** for full **`100dvh`**. Portrait vs landscape controls follow **viewport orientation**—widen the browser or use device rotation / fullscreen to hit **`orientation: landscape`**.

Static build for docs deployment:

```bash
npm run build-storybook
```

Output is written to `storybook-static/`.

Lint and format with [Biome](https://biomejs.dev/) (TypeScript + CSS + JSON):

```bash
npm run lint
npm run lint:fix
```

## Testing

Unit tests use [Vitest](https://vitest.dev/) with [happy-dom](https://github.com/capricorn86/happy-dom):

```bash
npm test
npm run test:watch
```
