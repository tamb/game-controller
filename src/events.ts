/**
 * Canonical custom event type strings for `@tamb/gamecontroller`.
 * Use nested keys (e.g. `EVENTS.gameController.dpad.up`) instead of raw strings
 * so listeners and `dispatchEvent` stay aligned.
 */
export const EVENTS = {
  gameController: {
    ancillary: {
      fullscreen: "gamecontroller:ancillary:fullscreen",
      select: "gamecontroller:ancillary:select",
      start: "gamecontroller:ancillary:start",
    },
    dpad: {
      up: "gamecontroller:dpad:up",
      right: "gamecontroller:dpad:right",
      down: "gamecontroller:dpad:down",
      left: "gamecontroller:dpad:left",
    },
    action: {
      a: "gamecontroller:action:a",
      b: "gamecontroller:action:b",
      x: "gamecontroller:action:x",
      y: "gamecontroller:action:y",
    },
  },
  gcDpad: {
    up: "gcdpad:up",
    right: "gcdpad:right",
    down: "gcdpad:down",
    left: "gcdpad:left",
  },
  gcJoystick: {
    move: "gcjoystick:move",
    sector: "gcjoystick:sector",
    clock: "gcjoystick:clock",
    cardinal: {
      up: "gcjoystick:cardinal:up",
      right: "gcjoystick:cardinal:right",
      down: "gcjoystick:cardinal:down",
      left: "gcjoystick:cardinal:left",
      none: "gcjoystick:cardinal:none",
    },
  },
  gcAncillary: {
    fullscreen: "gcancillary:fullscreen",
    select: "gcancillary:select",
    start: "gcancillary:start",
  },
  gcFace: {
    a: "gcface:a",
    b: "gcface:b",
    x: "gcface:x",
    y: "gcface:y",
  },
} as const;

export type GameControllerActionKey = keyof typeof EVENTS.gameController.action;

/** `gcjoystick:clock:{1…12}` */
export function gcJoystickClockHourEvent(hour: number): string {
  return `${EVENTS.gcJoystick.clock}:${hour}`;
}

/** Names subscribed by the full-shell Storybook story (includes nested `<gc-dpad>`). */
export const SB_GAME_CONTROLLER_EVENTS: readonly string[] = [
  ...Object.values(EVENTS.gameController.ancillary),
  ...Object.values(EVENTS.gameController.dpad),
  ...Object.values(EVENTS.gameController.action),
  ...Object.values(EVENTS.gcDpad),
  ...Object.values(EVENTS.gcAncillary),
  ...Object.values(EVENTS.gcFace),
];

export const SB_GC_DPAD_EVENTS: readonly string[] = Object.values(EVENTS.gcDpad);

export const SB_GC_FACE_EVENTS: readonly string[] = Object.values(EVENTS.gcFace);

export const SB_GC_ANCILLARY_EVENTS: readonly string[] = Object.values(EVENTS.gcAncillary);

export const SB_GC_JOYSTICK_EVENTS: readonly string[] = [
  EVENTS.gcJoystick.move,
  EVENTS.gcJoystick.sector,
  EVENTS.gcJoystick.clock,
  ...Array.from({ length: 12 }, (_, i) => gcJoystickClockHourEvent(i + 1)),
  ...Object.values(EVENTS.gcJoystick.cardinal),
];
