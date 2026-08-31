/**
 * Canonical custom event type strings for `@tamb/gamecontroller`.
 * Use nested keys (e.g. `EVENTS.gameController.dpad.up`) instead of raw strings
 * so listeners and `dispatchEvent` stay aligned.
 *
 * Press events (`gcdpad:up`, `gcface:a`, …) fire on pointerdown and on d-pad repeat.
 * Matching `*:released` events fire on pointerup / pointercancel / click-without-pointer.
 */
export const EVENTS = {
  gameController: {
    ancillary: {
      fullscreen: "gamecontroller:ancillary:fullscreen",
      select: "gamecontroller:ancillary:select",
      start: "gamecontroller:ancillary:start",
    },
    ancillaryReleased: {
      fullscreen: "gamecontroller:ancillary:fullscreen:released",
      select: "gamecontroller:ancillary:select:released",
      start: "gamecontroller:ancillary:start:released",
    },
    dpad: {
      up: "gamecontroller:dpad:up",
      right: "gamecontroller:dpad:right",
      down: "gamecontroller:dpad:down",
      left: "gamecontroller:dpad:left",
    },
    dpadReleased: {
      up: "gamecontroller:dpad:up:released",
      right: "gamecontroller:dpad:right:released",
      down: "gamecontroller:dpad:down:released",
      left: "gamecontroller:dpad:left:released",
    },
    action: {
      a: "gamecontroller:action:a",
      b: "gamecontroller:action:b",
      x: "gamecontroller:action:x",
      y: "gamecontroller:action:y",
    },
    actionReleased: {
      a: "gamecontroller:action:a:released",
      b: "gamecontroller:action:b:released",
      x: "gamecontroller:action:x:released",
      y: "gamecontroller:action:y:released",
    },
  },
  gcDpad: {
    up: "gcdpad:up",
    right: "gcdpad:right",
    down: "gcdpad:down",
    left: "gcdpad:left",
  },
  gcDpadReleased: {
    up: "gcdpad:up:released",
    right: "gcdpad:right:released",
    down: "gcdpad:down:released",
    left: "gcdpad:left:released",
  },
  gcJoystick: {
    pointerDown: "gcjoystick:pointerdown",
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
  gcAncillaryReleased: {
    fullscreen: "gcancillary:fullscreen:released",
    select: "gcancillary:select:released",
    start: "gcancillary:start:released",
  },
  gcFace: {
    a: "gcface:a",
    b: "gcface:b",
    x: "gcface:x",
    y: "gcface:y",
  },
  gcFaceReleased: {
    a: "gcface:a:released",
    b: "gcface:b:released",
    x: "gcface:x:released",
    y: "gcface:y:released",
  },
} as const;

export type GameControllerActionKey = keyof typeof EVENTS.gameController.action;

/** `gcjoystick:clock:{1…12}` */
export function gcJoystickClockHourEvent(hour: number): string {
  return `${EVENTS.gcJoystick.clock}:${hour}`;
}

/**
 * Names subscribed by the full-shell Storybook / demo event log.
 * Includes nested d-pad, face, ancillary, and joystick channels so
 * `left-control="joystick"` activity still appears in the log.
 */
export const SB_GAME_CONTROLLER_EVENTS: readonly string[] = [
  ...Object.values(EVENTS.gameController.ancillary),
  ...Object.values(EVENTS.gameController.ancillaryReleased),
  ...Object.values(EVENTS.gameController.dpad),
  ...Object.values(EVENTS.gameController.dpadReleased),
  ...Object.values(EVENTS.gameController.action),
  ...Object.values(EVENTS.gameController.actionReleased),
  ...Object.values(EVENTS.gcDpad),
  ...Object.values(EVENTS.gcDpadReleased),
  ...Object.values(EVENTS.gcAncillary),
  ...Object.values(EVENTS.gcAncillaryReleased),
  ...Object.values(EVENTS.gcFace),
  ...Object.values(EVENTS.gcFaceReleased),
  EVENTS.gcJoystick.pointerDown,
  EVENTS.gcJoystick.move,
  EVENTS.gcJoystick.sector,
  EVENTS.gcJoystick.clock,
  ...Object.values(EVENTS.gcJoystick.cardinal),
];

export const SB_GC_DPAD_EVENTS: readonly string[] = [
  ...Object.values(EVENTS.gcDpad),
  ...Object.values(EVENTS.gcDpadReleased),
];

export const SB_GC_FACE_EVENTS: readonly string[] = [
  ...Object.values(EVENTS.gcFace),
  ...Object.values(EVENTS.gcFaceReleased),
];

export const SB_GC_ANCILLARY_EVENTS: readonly string[] = [
  ...Object.values(EVENTS.gcAncillary),
  ...Object.values(EVENTS.gcAncillaryReleased),
];

export const SB_GC_JOYSTICK_EVENTS: readonly string[] = [
  EVENTS.gcJoystick.pointerDown,
  EVENTS.gcJoystick.move,
  EVENTS.gcJoystick.sector,
  EVENTS.gcJoystick.clock,
  ...Array.from({ length: 12 }, (_, i) => gcJoystickClockHourEvent(i + 1)),
  ...Object.values(EVENTS.gcJoystick.cardinal),
];
