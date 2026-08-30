import { Children as e, createElement as t, isValidElement as n, useLayoutEffect as r, useMemo as i, useRef as a, useState as o } from "react";
import s from "@r2wc/core";
import { createRoot as c } from "react-dom/client";
import { Fragment as l, jsx as u, jsxs as d } from "react/jsx-runtime";
//#region src/capabilities.ts
function f(e = typeof navigator < "u" ? navigator : void 0) {
	return typeof e?.vibrate == "function";
}
function p(e = typeof document < "u" ? document : void 0, t = typeof document < "u" ? document.documentElement : void 0) {
	if (!e) return !1;
	let n = e.fullscreenEnabled ?? e.webkitFullscreenEnabled;
	return typeof n == "boolean" ? n : typeof t?.requestFullscreen == "function" || typeof t?.webkitRequestFullscreen == "function";
}
function m(e = typeof document < "u" ? document : void 0, t = typeof navigator < "u" ? navigator : void 0, n = typeof document < "u" ? document.documentElement : void 0) {
	return {
		fullscreen: p(e, n),
		haptics: f(t)
	};
}
//#endregion
//#region src/events.ts
var h = {
	gameController: {
		ancillary: {
			fullscreen: "gamecontroller:ancillary:fullscreen",
			select: "gamecontroller:ancillary:select",
			start: "gamecontroller:ancillary:start"
		},
		dpad: {
			up: "gamecontroller:dpad:up",
			right: "gamecontroller:dpad:right",
			down: "gamecontroller:dpad:down",
			left: "gamecontroller:dpad:left"
		},
		action: {
			a: "gamecontroller:action:a",
			b: "gamecontroller:action:b",
			x: "gamecontroller:action:x",
			y: "gamecontroller:action:y"
		}
	},
	gcDpad: {
		up: "gcdpad:up",
		right: "gcdpad:right",
		down: "gcdpad:down",
		left: "gcdpad:left"
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
			none: "gcjoystick:cardinal:none"
		}
	},
	gcAncillary: {
		fullscreen: "gcancillary:fullscreen",
		select: "gcancillary:select",
		start: "gcancillary:start"
	},
	gcFace: {
		a: "gcface:a",
		b: "gcface:b",
		x: "gcface:x",
		y: "gcface:y"
	}
};
function g(e) {
	return `${h.gcJoystick.clock}:${e}`;
}
var _ = [
	...Object.values(h.gameController.ancillary),
	...Object.values(h.gameController.dpad),
	...Object.values(h.gameController.action),
	...Object.values(h.gcDpad),
	...Object.values(h.gcAncillary),
	...Object.values(h.gcFace),
	h.gcJoystick.pointerDown,
	h.gcJoystick.move,
	h.gcJoystick.sector,
	h.gcJoystick.clock,
	...Object.values(h.gcJoystick.cardinal)
], v = Object.values(h.gcDpad), y = Object.values(h.gcFace), b = Object.values(h.gcAncillary), x = [
	h.gcJoystick.pointerDown,
	h.gcJoystick.move,
	h.gcJoystick.sector,
	h.gcJoystick.clock,
	...Array.from({ length: 12 }, (e, t) => g(t + 1)),
	...Object.values(h.gcJoystick.cardinal)
];
function S(e, t = 10) {
	e && navigator.vibrate?.(t);
}
function C(e) {
	if (e === null) return !0;
	let t = e.trim().toLowerCase();
	return !(t === "false" || t === "0" || t === "off");
}
//#endregion
//#region src/lib/component-css.ts
function w(e, t) {
	let n = t.startsWith(".") ? t : `.${t}`;
	return e.replace(/:host(\([^)]+\))?/g, (e, t) => t ? `${n}${t.slice(1, -1)}` : n);
}
function T(e, t, n) {
	return n ? e : w(e, t);
}
//#endregion
//#region src/lib/dispatch-event.ts
function E(e, t, n) {
	e && e.dispatchEvent(new CustomEvent(t, {
		detail: n,
		bubbles: !0,
		composed: !0
	}));
}
//#endregion
//#region src/lib/r2wc-element.ts
var ee = Symbol.for("r2wc.render"), D = Symbol.for("r2wc.props");
function O() {
	return new Promise((e) => {
		queueMicrotask(() => {
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					queueMicrotask(e);
				});
			});
		});
	});
}
function k(e, t) {
	for (let n of t) e.hasAttribute(n) && e.getAttribute(n) === "" && e.setAttribute(n, "true");
}
function A(e, n = {}) {
	let { objectProps: r = [], emptyBooleanAttributes: i = [], ...a } = n, o = s(e, {
		shadow: "open",
		...a
	}, {
		mount(e, n, r) {
			let i = c(e);
			return i.render(t(n, r)), {
				root: i,
				Component: n
			};
		},
		update({ root: e, Component: n }, r) {
			e.render(t(n, r));
		},
		unmount({ root: e }) {
			e.unmount();
		}
	});
	class l extends o {
		get updateComplete() {
			return O();
		}
		connectedCallback() {
			k(this, i), o.prototype.connectedCallback.call(this);
		}
	}
	for (let e of r) Object.defineProperty(l.prototype, e, {
		enumerable: !0,
		configurable: !0,
		get() {
			return this[D][e];
		},
		set(t) {
			this[D][e] = t, this[ee]();
		}
	});
	return l;
}
function j(e, t) {
	customElements.get(e) || customElements.define(e, t);
}
//#endregion
//#region src/lib/shadow-host.ts
function M(e) {
	return e ? e.host instanceof HTMLElement : !1;
}
function N(e, t) {
	if (e) {
		let t = e.host;
		if (t instanceof HTMLElement) return t;
		if (e instanceof HTMLElement) return e;
	}
	if (t) {
		let e = t.getRootNode();
		if (e instanceof ShadowRoot && e.host instanceof HTMLElement) return e.host;
		if (t instanceof HTMLElement) return t;
	}
	return null;
}
//#endregion
//#region src/orientation.ts
async function P() {
	try {
		(globalThis.screen?.orientation)?.unlock?.();
	} catch {}
}
//#endregion
//#region src/components/gc-ancillary-buttons/gc-ancillary-buttons.css?raw
var F = "/**\n * Standalone ancillary row (fullscreen / select / start). `var(--gc-*, fallback)` matches\n * `<game-controller>` defaults for Storybook / embeds; inherited tokens override when set.\n */\n:host {\n  display: block;\n  width: 100%;\n  box-sizing: border-box;\n  color: var(--gc-color-text, #000000);\n  font-family: var(--gc-font-family, system-ui, sans-serif);\n}\n\n:host *,\n:host *::before,\n:host *::after {\n  box-sizing: inherit;\n}\n\n.gcancillary {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  flex-wrap: wrap;\n  width: 100%;\n}\n\n.gcancillary__btn {\n  margin: var(--gc-ancillary-margin, 5%);\n  padding: var(--gc-ancillary-padding, 1% 5%);\n  font-family: inherit;\n  font-size: var(--gc-ancillary-font-size, 0.8rem);\n  background: var(--gc-ancillary-btn-bg, transparent);\n  color: var(--gc-ancillary-btn-color, #000000);\n  border: var(--gc-ancillary-btn-border, 1px solid #000000);\n  border-radius: var(--gc-ancillary-btn-border-radius, 6px);\n}\n\n.gcancillary__btn:focus {\n  outline: none;\n}\n\n.gcancillary__btn:focus-visible {\n  outline: var(--gc-focus-ring, 2px solid #000000);\n  outline-offset: 2px;\n}\n", I = "gcancillary-host", L = [
	{
		id: "fullscreen",
		part: "btn-fullscreen"
	},
	{
		id: "select",
		part: "btn-select"
	},
	{
		id: "start",
		part: "btn-start"
	}
];
function R({ container: e, onPress: t }) {
	let n = a(null), r = M(e), i = T(F, I, r), o = (r) => {
		let i = N(e, n.current);
		if (!i) return;
		let a = {
			controller: i,
			id: r
		};
		t?.(a), E(i, h.gcAncillary[r], a);
	};
	return /* @__PURE__ */ d(l, { children: [/* @__PURE__ */ u("style", { children: i }), /* @__PURE__ */ u("div", {
		ref: n,
		className: r ? "gcancillary" : `${I} gcancillary`,
		part: "row",
		children: L.map(({ id: e, part: t }) => /* @__PURE__ */ u("button", {
			type: "button",
			className: "gcancillary__btn",
			part: t,
			id: e === "fullscreen" ? "fullscreen" : void 0,
			onClick: () => o(e),
			children: e
		}, e))
	})] });
}
var z = A(R);
j("gc-ancillary-buttons", z);
//#endregion
//#region src/components/gc-dpad/gc-dpad.css?raw
var B = "/**\n * D-pad shell. Inherits `--gc-dpad-*` from ancestors (e.g. `<game-controller>`).\n * Standalone defaults match neutral monochrome (transparent pads, black borders).\n */\n:host {\n  display: block;\n  width: 100%;\n  box-sizing: border-box;\n\n  --gc-dpad-axis: 66px;\n  --gc-dpad-half: 33px;\n  --gc-dpad-btn-bg: transparent;\n  --gc-dpad-btn-color: transparent;\n  --gc-dpad-btn-border-width: 1px;\n  --gc-dpad-btn-border-style: solid;\n  --gc-dpad-btn-border-color: #000000;\n  --gc-dpad-btn-border: var(--gc-dpad-btn-border-width) var(--gc-dpad-btn-border-style)\n    var(--gc-dpad-btn-border-color);\n  --gc-dpad-btn-border-radius: 4px;\n\n  --gc-focus-ring-width: 2px;\n  --gc-focus-ring-style: solid;\n  --gc-focus-ring-color: #000000;\n  --gc-focus-ring: var(--gc-focus-ring-width) var(--gc-focus-ring-style) var(--gc-focus-ring-color);\n}\n\n:host *,\n:host *::before,\n:host *::after {\n  box-sizing: inherit;\n}\n\n.gcdpad {\n  display: flex;\n  flex-wrap: wrap;\n  width: 100%;\n  justify-content: space-between;\n}\n\n.gcdpad__btn {\n  margin-bottom: 5%;\n  background: var(--gc-dpad-btn-bg);\n  color: var(--gc-dpad-btn-color);\n  border: var(--gc-dpad-btn-border);\n  border-radius: var(--gc-dpad-btn-border-radius);\n  cursor: pointer;\n}\n\n.gcdpad__btn--up {\n  background: var(--gc-dpad-btn-up-bg, var(--gc-dpad-btn-bg));\n  color: var(--gc-dpad-btn-up-color, var(--gc-dpad-btn-color));\n  border: var(--gc-dpad-btn-up-border, var(--gc-dpad-btn-border));\n  height: var(--gc-dpad-axis);\n  width: 25%;\n  margin-left: 38%;\n  margin-right: 38%;\n}\n\n.gcdpad__btn--right {\n  background: var(--gc-dpad-btn-right-bg, var(--gc-dpad-btn-bg));\n  color: var(--gc-dpad-btn-right-color, var(--gc-dpad-btn-color));\n  border: var(--gc-dpad-btn-right-border, var(--gc-dpad-btn-border));\n  width: 38%;\n  height: var(--gc-dpad-half);\n}\n\n.gcdpad__btn--down {\n  background: var(--gc-dpad-btn-down-bg, var(--gc-dpad-btn-bg));\n  color: var(--gc-dpad-btn-down-color, var(--gc-dpad-btn-color));\n  border: var(--gc-dpad-btn-down-border, var(--gc-dpad-btn-border));\n  height: var(--gc-dpad-axis);\n  width: 25%;\n  margin-left: 38%;\n  margin-right: 38%;\n}\n\n.gcdpad__btn--left {\n  background: var(--gc-dpad-btn-left-bg, var(--gc-dpad-btn-bg));\n  color: var(--gc-dpad-btn-left-color, var(--gc-dpad-btn-color));\n  border: var(--gc-dpad-btn-left-border, var(--gc-dpad-btn-border));\n  width: 38%;\n  height: var(--gc-dpad-half);\n}\n\n.gcdpad__btn:focus {\n  outline: none;\n}\n\n.gcdpad__btn:focus-visible {\n  outline: var(--gc-focus-ring);\n  outline-offset: 2px;\n}\n", V = "gcdpad-host", te = [
	"up",
	"left",
	"right",
	"down"
];
function H({ container: e, onDirection: t }) {
	let n = a(null), r = M(e), i = T(B, V, r), o = (r) => {
		let i = N(e, n.current);
		if (!i) return;
		let a = {
			controller: i,
			direction: r
		};
		t?.(a), E(i, h.gcDpad[r], a);
	};
	return /* @__PURE__ */ d(l, { children: [/* @__PURE__ */ u("style", { children: i }), /* @__PURE__ */ u("div", {
		ref: n,
		className: r ? "gcdpad" : `${V} gcdpad`,
		part: "base",
		children: te.map((e) => /* @__PURE__ */ u("button", {
			type: "button",
			className: `gcdpad__btn gcdpad__btn--${e}`,
			"aria-label": e[0].toUpperCase() + e.slice(1),
			part: `btn-${e}`,
			onClick: () => o(e)
		}, e))
	})] });
}
var U = A(H);
j("gc-dpad", U);
//#endregion
//#region src/components/game-controller/game-controller-layout.ts
var ne = [
	"y",
	"x",
	"b",
	"a"
], re = ["a", "b"];
function ie(e) {
	return e === 2 ? re : ne;
}
function ae(e) {
	return e === 2 ? "gcface__actions gcface__actions--two" : "gcface__actions gcface__actions--four";
}
function oe(e) {
	return e === "joystick" ? "joystick" : "dpad";
}
//#endregion
//#region src/components/gc-face-buttons/gc-face-buttons.css?raw
var se = "/**\n * Face / action buttons (A/B or Y/X/B/A). `var(--gc-*, fallback)` uses the same defaults as\n * `<game-controller>` so Storybook / embeds work without a shell; inherited tokens from an\n * ancestor still override when set.\n */\n:host {\n  display: block;\n  width: 100%;\n  box-sizing: border-box;\n  color: var(--gc-color-text, #000000);\n  font-family: var(--gc-font-family, system-ui, sans-serif);\n}\n\n:host *,\n:host *::before,\n:host *::after {\n  box-sizing: inherit;\n}\n\n.gcface__actions {\n  width: 100%;\n  display: flex;\n  flex-direction: column-reverse;\n  justify-content: flex-end;\n}\n\n.gcface__btn {\n  width: var(--gc-action-size, 50px);\n  height: var(--gc-action-size, 50px);\n  font-family: inherit;\n  font-size: var(--gc-action-font-size, 0.75rem);\n  font-weight: 600;\n  border-radius: var(--gc-action-btn-border-radius, 50%);\n}\n\n.gcface__btn:focus {\n  outline: none;\n}\n\n.gcface__btn:focus-visible {\n  outline: var(--gc-focus-ring, 2px solid #000000);\n  outline-offset: 2px;\n}\n\n.gcface__btn--1 {\n  margin-left: auto;\n  background: var(--gc-action-btn-1-bg, var(--gc-action-btn-bg, #ffffff));\n  color: var(--gc-action-btn-1-color, var(--gc-action-btn-color, #000000));\n  border: var(--gc-action-btn-1-border, var(--gc-action-btn-border, 1px solid #000000));\n}\n\n.gcface__btn--2 {\n  margin-left: calc(50% - var(--gc-action-size, 50px));\n  background: var(--gc-action-btn-2-bg, var(--gc-action-btn-bg, #ffffff));\n  color: var(--gc-action-btn-2-color, var(--gc-action-btn-color, #000000));\n  border: var(--gc-action-btn-2-border, var(--gc-action-btn-border, 1px solid #000000));\n}\n\n.gcface__btn--3 {\n  background: var(--gc-action-btn-3-bg, var(--gc-action-btn-bg, #ffffff));\n  color: var(--gc-action-btn-3-color, var(--gc-action-btn-color, #000000));\n  border: var(--gc-action-btn-3-border, var(--gc-action-btn-border, 1px solid #000000));\n}\n\n.gcface__btn--4 {\n  background: var(--gc-action-btn-4-bg, var(--gc-action-btn-bg, #ffffff));\n  color: var(--gc-action-btn-4-color, var(--gc-action-btn-color, #000000));\n  border: var(--gc-action-btn-4-border, var(--gc-action-btn-border, 1px solid #000000));\n}\n\n.gcface__actions--four {\n  margin-left: 5%;\n  flex-wrap: wrap;\n  flex-direction: column;\n  justify-content: initial;\n}\n\n.gcface__actions--four .gcface__btn--1 {\n  margin-left: calc(50% - var(--gc-action-size, 50px) / 4);\n}\n\n.gcface__actions--four .gcface__btn--3 {\n  margin-left: auto;\n  margin-top: calc(-1 * var(--gc-action-size, 50px));\n}\n\n.gcface__actions--four .gcface__btn--4 {\n  margin-left: calc(50% - var(--gc-action-size, 50px) / 4);\n  margin-bottom: 30%;\n}\n\n/** Landscape viewport: diamond margins match `<game-controller>` landscape flex row. */\n@media (orientation: landscape) {\n  .gcface__actions--four .gcface__btn--1 {\n    margin-left: calc(50% - var(--gc-action-size, 50px) / 8);\n  }\n\n  .gcface__actions--four .gcface__btn--2 {\n    margin-right: auto;\n  }\n\n  .gcface__actions--four .gcface__btn--3 {\n    margin-left: auto;\n  }\n\n  .gcface__actions--four .gcface__btn--4 {\n    margin-left: calc(50% - var(--gc-action-size, 50px) / 8);\n  }\n}\n", ce = "gcface-host";
function W({ actions: e = 2, container: t, onButton: n }) {
	let r = a(null), i = M(t), o = T(se, ce, i), s = ie(e), c = ae(e), f = (e) => {
		let i = N(t, r.current);
		if (!i) return;
		let a = {
			controller: i,
			button: e
		};
		n?.(a), E(i, h.gcFace[e], a);
	};
	return /* @__PURE__ */ d(l, { children: [/* @__PURE__ */ u("style", { children: o }), /* @__PURE__ */ u("div", {
		ref: r,
		className: i ? c : `${ce} ${c}`,
		part: "actions",
		children: s.map((e, t) => /* @__PURE__ */ u("button", {
			type: "button",
			className: `gcface__btn gcface__btn--${t + 1}`,
			part: `btn-${e}`,
			onClick: () => f(e),
			children: e.toUpperCase()
		}, e))
	})] });
}
var le = A(W, { props: { actions: "number" } });
j("gc-face-buttons", le);
//#endregion
//#region src/components/gc-joystick/gc-joystick.css?raw
var ue = ":host {\n  display: block;\n  width: 100%;\n  max-width: 140px;\n  aspect-ratio: 1;\n  box-sizing: border-box;\n\n  --gc-joystick-ring-bg: transparent;\n  --gc-joystick-ring-border-width: 1px;\n  --gc-joystick-ring-border-color: #000000;\n  --gc-joystick-ring-border: var(--gc-joystick-ring-border-width) solid\n    var(--gc-joystick-ring-border-color);\n\n  --gc-joystick-knob-bg: #ffffff;\n  --gc-joystick-knob-border: 1px solid #000000;\n  --gc-joystick-knob-size: 28px;\n\n  --gc-focus-ring-width: 2px;\n  --gc-focus-ring-style: solid;\n  --gc-focus-ring-color: #000000;\n  --gc-focus-ring: var(--gc-focus-ring-width) var(--gc-focus-ring-style) var(--gc-focus-ring-color);\n}\n\n:host *,\n:host *::before,\n:host *::after {\n  box-sizing: inherit;\n}\n\n.gcjoystick {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  touch-action: none;\n}\n\n.gcjoystick__ring {\n  position: absolute;\n  inset: 0;\n  border-radius: 50%;\n  background: var(--gc-joystick-ring-bg);\n  border: var(--gc-joystick-ring-border);\n}\n\n.gcjoystick__knob {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  width: var(--gc-joystick-knob-size);\n  height: var(--gc-joystick-knob-size);\n  border-radius: 50%;\n  background: var(--gc-joystick-knob-bg);\n  border: var(--gc-joystick-knob-border);\n  cursor: grab;\n  box-shadow: none;\n}\n\n.gcjoystick__knob:active {\n  cursor: grabbing;\n}\n\n.gcjoystick__knob:focus {\n  outline: none;\n}\n\n.gcjoystick__knob:focus-visible {\n  outline: var(--gc-focus-ring);\n  outline-offset: 2px;\n}\n", G = [
	{
		id: "n",
		startDeg: 337.5,
		endDeg: 22.5
	},
	{
		id: "ne",
		startDeg: 22.5,
		endDeg: 67.5
	},
	{
		id: "e",
		startDeg: 67.5,
		endDeg: 112.5
	},
	{
		id: "se",
		startDeg: 112.5,
		endDeg: 157.5
	},
	{
		id: "s",
		startDeg: 157.5,
		endDeg: 202.5
	},
	{
		id: "sw",
		startDeg: 202.5,
		endDeg: 247.5
	},
	{
		id: "w",
		startDeg: 247.5,
		endDeg: 292.5
	},
	{
		id: "nw",
		startDeg: 292.5,
		endDeg: 337.5
	}
];
function K(e) {
	let t = e % 360;
	return t < 0 && (t += 360), t;
}
function de(e, t) {
	return K(Math.atan2(e, -t) * 180 / Math.PI);
}
function fe(e, t, n) {
	let r = K(e), i = K(t), a = K(n);
	return i <= a ? r >= i && r <= a : r >= i || r <= a;
}
function pe(e, t) {
	for (let n of e) if (fe(t, n.startDeg, n.endDeg)) return n.id;
	return null;
}
function me(e) {
	let t = K(e);
	return t >= 315 || t < 45 ? "up" : t < 135 ? "right" : t < 225 ? "down" : "left";
}
function he(e) {
	let t = K(e + 15), n = Math.floor(t / 30);
	return n === 0 ? 12 : n;
}
function q(e) {
	return `${e}-oclock`;
}
function ge(e, t, n) {
	let r = Math.hypot(e, t);
	return r > n && r > 0 ? {
		dx: e / r * n,
		dy: t / r * n
	} : {
		dx: e,
		dy: t
	};
}
function _e(e) {
	let { pointerDx: t, pointerDy: n, maxTravel: r, deadZone: i } = e, { dx: a, dy: o } = ge(t, n, r), s = r > 0 ? a / r : 0, c = r > 0 ? o / r : 0, l = Math.min(1, Math.hypot(s, c));
	return l < i ? {
		knobDx: 0,
		knobDy: 0,
		nx: 0,
		ny: 0,
		mag: 0,
		angleDeg: null
	} : {
		knobDx: a,
		knobDy: o,
		nx: s,
		ny: c,
		mag: l,
		angleDeg: de(a, o)
	};
}
function ve(e, t) {
	let n = e.angleDeg, r = n === null ? null : pe(t, n), i = n === null ? "none" : me(n), a = n === null ? null : he(n), o = a === null ? null : q(a);
	return {
		x: e.nx,
		y: e.ny,
		magnitude: e.mag,
		angleDeg: n,
		angleRad: n === null ? null : n * Math.PI / 180,
		sectorId: r,
		cardinal: i,
		clockHour: a,
		clockLabel: o
	};
}
function ye(e) {
	if (!e) return null;
	try {
		let t = JSON.parse(e);
		return !Array.isArray(t) || t.length === 0 ? null : t;
	} catch {
		return null;
	}
}
//#endregion
//#region src/components/gc-joystick/gc-joystick.tsx
var be = "gcjoystick-host", xe = "gc-joystick";
function J(e, t = !1) {
	return e === !0 ? !0 : e === !1 || e == null ? t : typeof e == "string" ? e === "" || /^[ty1-9]/i.test(e) : !!e;
}
function Se(e, t) {
	return e ? ye(e) ?? [...G] : Array.isArray(t) && t.length > 0 ? t : [...G];
}
function Y({ deadZone: e = .12, emitCardinal: t, emitClock: n, emitSectors: r, sectorsJson: s, sectors: c, container: f, onPointerDown: p, onMove: m }) {
	let _ = a(null), v = a(null), y = a("none"), b = a(null), x = a(null), S = a(!1), [C, w] = o({
		dx: 0,
		dy: 0
	}), ee = M(f), D = T(ue, be, ee), O = J(t), k = J(n), A = J(r), j = i(() => Se(s, c), [s, c]), P = () => N(f, _.current), F = (e) => e, I = (e) => {
		let t = P();
		return t ? {
			controller: t,
			...ve(e, j)
		} : null;
	}, L = (e) => {
		let t = I(e);
		return t ? (m?.(t), E(t.controller, h.gcJoystick.move, { ...t }), t) : null;
	}, R = (e) => {
		if (O && e.cardinal !== y.current) {
			let t = y.current;
			y.current = e.cardinal, E(e.controller, h.gcJoystick.cardinal[e.cardinal], {
				...e,
				previousCardinal: t
			});
		}
		if (A) {
			let t = e.sectorId;
			if (t !== b.current) {
				let n = b.current;
				b.current = t, E(e.controller, h.gcJoystick.sector, {
					...e,
					previousSectorId: n
				});
			}
		}
		if (k) {
			let t = e.clockHour;
			if (t !== x.current) {
				let n = x.current;
				x.current = t, t !== null && E(e.controller, g(t), {
					...e,
					hour: t,
					previousHour: n
				}), E(e.controller, h.gcJoystick.clock, {
					...e,
					hour: t,
					previousHour: n,
					label: e.clockLabel,
					previousLabel: n === null ? null : q(n)
				});
			}
		}
	}, z = () => {
		let e = P() ?? _.current;
		if (!e) return 14;
		let t = getComputedStyle(e).getPropertyValue("--gc-joystick-knob-size").trim();
		return (Number.parseFloat(t || "28") || 28) / 2;
	}, B = (t, n) => {
		let r = v.current;
		if (!r) return;
		let i = r.getBoundingClientRect(), a = i.left + i.width / 2, o = i.top + i.height / 2, s = z(), c = Math.max(8, Math.min(i.width, i.height) / 2 - s - 2), l = _e({
			pointerDx: t - a,
			pointerDy: n - o,
			maxTravel: c,
			deadZone: e
		});
		w({
			dx: l.knobDx,
			dy: l.knobDy
		});
		let u = L(F(l));
		u && R(u);
	}, V = () => {
		S.current = !1;
		let e = F({
			knobDx: 0,
			knobDy: 0,
			nx: 0,
			ny: 0,
			mag: 0,
			angleDeg: null
		});
		w({
			dx: 0,
			dy: 0
		});
		let t = L(e);
		if (t) {
			if (O && y.current !== "none") {
				let e = y.current;
				y.current = "none", E(t.controller, h.gcJoystick.cardinal.none, {
					...t,
					previousCardinal: e
				});
			}
			if (A && b.current !== null) {
				let e = b.current;
				b.current = null, E(t.controller, h.gcJoystick.sector, {
					...t,
					sectorId: null,
					previousSectorId: e
				});
			}
			if (k && x.current !== null) {
				let e = x.current;
				x.current = null, E(t.controller, h.gcJoystick.clock, {
					...t,
					hour: null,
					previousHour: e,
					label: null,
					previousLabel: e === null ? null : q(e)
				});
			}
		}
	}, te = (e) => {
		e.preventDefault(), S.current = !0, e.currentTarget.setPointerCapture(e.pointerId);
		let t = P();
		t && (p?.({ controller: t }), E(t, h.gcJoystick.pointerDown, { controller: t })), B(e.clientX, e.clientY);
	}, H = (e) => {
		S.current && (e.preventDefault(), B(e.clientX, e.clientY));
	}, U = (e) => {
		if (S.current) {
			e.preventDefault();
			try {
				e.currentTarget.releasePointerCapture(e.pointerId);
			} catch {}
			V();
		}
	}, ne = () => {
		S.current && V();
	}, re = `translate(calc(-50% + ${C.dx}px), calc(-50% + ${C.dy}px))`;
	return /* @__PURE__ */ d(l, { children: [/* @__PURE__ */ u("style", { children: D }), /* @__PURE__ */ d("div", {
		ref: _,
		className: ee ? "gcjoystick" : `${be} gcjoystick`,
		part: "base",
		"data-emit-cardinal": O ? "" : void 0,
		children: [/* @__PURE__ */ u("div", {
			ref: v,
			className: "gcjoystick__ring",
			part: "ring"
		}), /* @__PURE__ */ u("button", {
			type: "button",
			className: "gcjoystick__knob",
			part: "knob",
			"aria-label": "Joystick",
			style: { transform: re },
			onPointerDown: te,
			onPointerMove: H,
			onPointerUp: U,
			onPointerCancel: U,
			onLostPointerCapture: ne
		})]
	})] });
}
var X = A(Y, {
	props: {
		deadZone: "number",
		emitCardinal: "boolean",
		emitClock: "boolean",
		emitSectors: "boolean",
		sectorsJson: "string"
	},
	objectProps: ["sectors"],
	emptyBooleanAttributes: [
		"emit-cardinal",
		"emit-clock",
		"emit-sectors"
	]
}), Ce = Object.getOwnPropertyDescriptor(X.prototype, "sectors"), we = Symbol.for("r2wc.props");
Object.defineProperty(X.prototype, "sectors", {
	enumerable: !0,
	configurable: !0,
	get() {
		let e = this[we];
		return Se(e?.sectorsJson, e?.sectors);
	},
	set(e) {
		Ce?.set?.call(this, e);
	}
}), j(xe, X);
//#endregion
//#region src/components/game-controller/game-controller.css?raw
var Te = "/**\n * All tokens use the `--gc-` prefix (game controller). Defaults are neutral monochrome\n * (black strokes/text, white or transparent fills). Set overrides on `<game-controller>`:\n *\n *   game-controller {\n *     --gc-shell-bg: #111;\n *     --gc-action-btn-bg: #333;\n *   }\n *\n * Layout fills the dynamic viewport (`100dvh` / `100dvw`) with safe-area insets. Portrait\n * (`orientation: portrait`): `.gamecontroller__center` (stage → ancillary), then\n * `.gamecontroller__main-controls` row (stick | face buttons). Landscape uses flex `order` +\n * `display: contents` on `.gamecontroller__main-controls` so stick | center | actions read left\n * to right. Fullscreen uses `requestFullscreen()` on `<game-controller>`.\n */\n:host {\n  display: flex;\n  flex-direction: column;\n  box-sizing: border-box;\n  width: 100%;\n  max-width: 100%;\n  /**\n   * Default fills the dynamic viewport. For embedded previews, set on an ancestor:\n   * `--gc-host-min-height: 100%` and `--gc-host-height: 100%`.\n   */\n  min-height: var(--gc-host-min-height, 100vh);\n  /* biome-ignore lint/suspicious/noDuplicateProperties: progressive enhancement */\n  min-height: var(--gc-host-min-height, 100dvh);\n  height: var(--gc-host-height, auto);\n\n  /* Typography */\n  --gc-font-family: system-ui, sans-serif;\n  --gc-color-text: #000000;\n  --gc-action-font-size: 0.75rem;\n  --gc-ancillary-font-size: 0.8rem;\n\n  /* Shell (outer device / viewport chrome) */\n  --gc-shell-bg: #ffffff;\n  --gc-shell-border-width: 0;\n  --gc-shell-border-style: solid;\n  --gc-shell-border-color: transparent;\n  --gc-shell-border: var(--gc-shell-border-width) var(--gc-shell-border-style)\n    var(--gc-shell-border-color);\n\n  /* Stage (“screen”) */\n  --gc-stage-bg: transparent;\n  --gc-stage-border-width: 1px;\n  --gc-stage-border-style: solid;\n  --gc-stage-border-color: #000000;\n  --gc-stage-border: var(--gc-stage-border-width) var(--gc-stage-border-style)\n    var(--gc-stage-border-color);\n  /** Cap stage height in portrait; unset in landscape via media query. */\n  --gc-stage-max-height: 100%;\n\n  /* Control bands (behind d-pad / face buttons) */\n  --gc-main-controls-bg: transparent;\n\n  /* Face buttons (default + optional --gc-action-btn-{1-4}-* ) */\n  --gc-action-size: 50px;\n  --gc-action-btn-bg: #ffffff;\n  --gc-action-btn-color: #000000;\n  --gc-action-btn-border-width: 1px;\n  --gc-action-btn-border-style: solid;\n  --gc-action-btn-border-color: #000000;\n  --gc-action-btn-border: var(--gc-action-btn-border-width) var(--gc-action-btn-border-style)\n    var(--gc-action-btn-border-color);\n  --gc-action-btn-border-radius: 50%;\n\n  /* Ancillary row (fullscreen / select / start) */\n  --gc-ancillary-btn-bg: transparent;\n  --gc-ancillary-btn-color: #000000;\n  --gc-ancillary-btn-border-width: 1px;\n  --gc-ancillary-btn-border-style: solid;\n  --gc-ancillary-btn-border-color: #000000;\n  --gc-ancillary-btn-border: var(--gc-ancillary-btn-border-width)\n    var(--gc-ancillary-btn-border-style) var(--gc-ancillary-btn-border-color);\n  --gc-ancillary-btn-border-radius: 6px;\n  --gc-ancillary-margin: 5%;\n  --gc-ancillary-padding: 1% 5%;\n\n  /* D-pad */\n  --gc-dpad-axis: 66px;\n  --gc-dpad-half: 33px;\n  --gc-dpad-btn-bg: transparent;\n  --gc-dpad-btn-color: transparent;\n  --gc-dpad-btn-border-width: 1px;\n  --gc-dpad-btn-border-style: solid;\n  --gc-dpad-btn-border-color: #000000;\n  --gc-dpad-btn-border: var(--gc-dpad-btn-border-width) var(--gc-dpad-btn-border-style)\n    var(--gc-dpad-btn-border-color);\n  --gc-dpad-btn-border-radius: 4px;\n  --gc-dpad-axis-landscape: 66px;\n  --gc-dpad-half-landscape: 33px;\n\n  /* Focus ring (keyboard) */\n  --gc-focus-ring-width: 2px;\n  --gc-focus-ring-style: solid;\n  --gc-focus-ring-color: #000000;\n  --gc-focus-ring: var(--gc-focus-ring-width) var(--gc-focus-ring-style) var(--gc-focus-ring-color);\n\n  color: var(--gc-color-text);\n  font-family: var(--gc-font-family);\n}\n\n/* iOS Safari legacy full-height when parent chain lacks height */\n@supports (-webkit-touch-callout: none) {\n  :host {\n    min-height: var(--gc-host-min-height, -webkit-fill-available);\n  }\n}\n\n:host(:fullscreen) {\n  width: 100%;\n  height: 100%;\n  min-height: 100%;\n  max-height: 100%;\n}\n\n:host *,\n:host *::before,\n:host *::after {\n  box-sizing: inherit;\n}\n\n.gamecontroller__shell {\n  flex: 1 1 auto;\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  min-width: 0;\n  min-height: 0;\n}\n\n.gamecontroller__container {\n  flex: 1 1 auto;\n  display: flex;\n  flex-direction: column;\n  flex-wrap: nowrap;\n  justify-content: flex-start;\n  align-items: stretch;\n  width: 100%;\n  min-width: 0;\n  min-height: 0;\n  overflow: hidden;\n  padding-top: env(safe-area-inset-top, 0px);\n  padding-right: env(safe-area-inset-right, 0px);\n  padding-bottom: env(safe-area-inset-bottom, 0px);\n  padding-left: env(safe-area-inset-left, 0px);\n  background: var(--gc-shell-bg);\n  border: var(--gc-shell-border);\n}\n\n:host(:fullscreen) .gamecontroller__shell {\n  flex: 1 1 auto;\n  min-height: 0;\n}\n\n:host(:fullscreen) .gamecontroller__container {\n  min-height: 0;\n}\n\n/**\n * Screen stack: stage then ancillary row (portrait reading order; landscape this column sits\n * between stick and actions via flex order).\n */\n.gamecontroller__center {\n  display: flex;\n  flex-direction: column;\n  flex: 1 1 0;\n  min-width: 0;\n  min-height: 0;\n  overflow: hidden;\n}\n\n.gamecontroller__stage {\n  flex: 1 1 0;\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n  min-height: min(40dvh, 50%);\n  max-height: var(--gc-stage-max-height);\n  overflow: hidden;\n  background: var(--gc-stage-bg);\n  border: var(--gc-stage-border);\n  width: 100%;\n  max-width: 100%;\n  position: relative;\n  z-index: 1;\n}\n\n.gamecontroller__stage ::slotted(*),\n.gamecontroller__stage > * {\n  flex: 1 1 auto;\n  min-height: 0;\n  min-width: 0;\n  width: 100%;\n  align-self: stretch;\n  overflow: auto;\n  -webkit-overflow-scrolling: touch;\n  overscroll-behavior: contain;\n}\n\n.gamecontroller__ancillaries {\n  flex: 0 0 auto;\n  width: 100%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  flex-wrap: wrap;\n}\n\n.gamecontroller__main-controls {\n  flex: 0 0 auto;\n  width: 100%;\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  align-items: flex-end;\n  gap: 0.5rem;\n  padding: 0.75rem 2.5% 0;\n  margin-bottom: 0;\n  background: var(--gc-main-controls-bg);\n}\n\n.gamecontroller__d-pad-container {\n  flex: 0 0 auto;\n  width: 45%;\n  max-width: 50%;\n  margin-left: 0;\n  margin-top: 0;\n  align-self: flex-end;\n  display: flex;\n  align-items: flex-end;\n  justify-content: flex-start;\n  min-width: 0;\n}\n\n.gamecontroller__d-pad-container gc-joystick,\n.gamecontroller__d-pad-container .gcjoystick,\n.gamecontroller__d-pad-container .gcjoystick-host,\n.gamecontroller__d-pad-container ::slotted(*) {\n  display: block;\n  width: 100%;\n  max-width: 140px;\n  margin-bottom: 4px;\n}\n\n.gamecontroller__ancillaries gc-ancillary-buttons,\n.gamecontroller__ancillaries .gcancillary,\n.gamecontroller__ancillaries .gcancillary-host,\n.gamecontroller__ancillaries ::slotted(*) {\n  display: block;\n  width: 100%;\n}\n\n.gamecontroller__d-pad-container gc-dpad,\n.gamecontroller__d-pad-container .gcdpad,\n.gamecontroller__d-pad-container .gcdpad-host {\n  display: block;\n  width: 100%;\n}\n\n.gamecontroller__actions {\n  flex: 0 0 auto;\n  width: 45%;\n  max-width: 50%;\n  align-self: flex-end;\n  margin-right: 0;\n  min-width: 0;\n}\n\n.gamecontroller__actions gc-face-buttons,\n.gamecontroller__actions .gcface-host,\n.gamecontroller__actions .gcface__actions,\n.gamecontroller__actions ::slotted(*) {\n  display: block;\n  width: 100%;\n}\n\n@media (orientation: landscape) {\n  .gamecontroller__shell {\n    --gc-dpad-axis: var(--gc-dpad-axis-landscape);\n    --gc-dpad-half: var(--gc-dpad-half-landscape);\n    --gc-ancillary-margin: 0 1%;\n    --gc-ancillary-padding: 0.25% 5%;\n  }\n\n  .gamecontroller__container {\n    flex-direction: row;\n    align-items: stretch;\n    column-gap: clamp(0.25rem, 2vmin, 0.75rem);\n    row-gap: clamp(0.25rem, 1.5vh, 0.5rem);\n  }\n\n  /**\n   * Hoist d-pad + actions to siblings of `.gamecontroller__center` so flex `order` can place:\n   * stick (1) | center column (2) | face buttons (3).\n   */\n  .gamecontroller__main-controls {\n    display: contents;\n  }\n\n  .gamecontroller__d-pad-container {\n    order: 1;\n    flex: 0 1 26%;\n    width: auto;\n    max-width: none;\n    align-self: stretch;\n    align-items: center;\n    justify-content: center;\n    padding: clamp(0.15rem, 1.2vmin, 0.45rem);\n    /* `display: contents` on main-controls drops its background; paint sides instead. */\n    background: var(--gc-main-controls-bg);\n  }\n\n  .gamecontroller__d-pad-container gc-joystick,\n  .gamecontroller__d-pad-container .gcjoystick,\n  .gamecontroller__d-pad-container .gcjoystick-host,\n  .gamecontroller__d-pad-container ::slotted(*) {\n    margin-bottom: 0;\n    max-width: min(140px, 100%);\n  }\n\n  .gamecontroller__center {\n    order: 2;\n    flex: 1 1 0;\n    min-width: 0;\n    min-height: 0;\n    row-gap: clamp(0.25rem, 1.5vh, 0.5rem);\n    --gc-stage-max-height: none;\n  }\n\n  .gamecontroller__stage {\n    flex: 1 1 0;\n    min-height: 0;\n    max-height: none;\n    width: auto;\n    max-width: none;\n  }\n\n  .gamecontroller__ancillaries {\n    flex: 0 0 auto;\n    width: 100%;\n  }\n\n  .gamecontroller__actions {\n    order: 3;\n    flex: 0 1 26%;\n    width: auto;\n    max-width: none;\n    align-self: stretch;\n    align-items: center;\n    justify-content: center;\n    display: flex;\n    padding: clamp(0.15rem, 1.2vmin, 0.45rem);\n    background: var(--gc-main-controls-bg);\n  }\n\n  :host(:fullscreen) .gamecontroller__container {\n    /* Fullscreen + landscape: keep the three-column band edge-to-edge. */\n    min-height: 100%;\n  }\n}\n", Z = {
	stage: "stage",
	ancillaries: "ancillaries",
	leftControl: "left-control",
	actions: "actions"
}, Ee = Symbol.for("game-controller.slot");
function Q(e, t) {
	function n({ children: t, className: n, ...r }) {
		return /* @__PURE__ */ u("div", {
			slot: e,
			className: n,
			...r,
			children: t
		});
	}
	return n.displayName = t, n[Ee] = e, n;
}
var De = Q(Z.stage, "GameController.Stage"), Oe = Q(Z.ancillaries, "GameController.Ancillaries"), ke = Q(Z.leftControl, "GameController.LeftControl"), Ae = Q(Z.actions, "GameController.Actions");
function je(e) {
	let t = e.props.slot;
	if (t === Z.stage || t === Z.ancillaries || t === Z.leftControl || t === Z.actions) return t;
	let n = e.type;
	if (typeof n == "function" && Ee in n) return n[Ee];
}
function Me(t) {
	let r = [], i = [], a = [], o = [], s = [];
	return e.forEach(t, (e) => {
		if (e == null || e === !1 || e === !0) return;
		if (!n(e)) {
			s.push(e);
			return;
		}
		let t = je(e);
		t === Z.stage ? r.push(e) : t === Z.ancillaries ? i.push(e) : t === Z.leftControl ? a.push(e) : t === Z.actions ? o.push(e) : s.push(e);
	}), {
		stage: r.length > 0 ? r : s,
		ancillaries: i,
		leftControl: a,
		actions: o
	};
}
function Ne(e) {
	return e.length > 0;
}
//#endregion
//#region src/components/game-controller/game-controller.tsx
var Pe = "game-controller", Fe = "game-controller";
function Ie(e) {
	return e === !1 ? !1 : e === !0 || e == null ? !0 : typeof e == "string" ? C(e) : !!e;
}
function $({ name: e, inShadow: t, assigned: n, fallback: r }) {
	return t ? /* @__PURE__ */ u("slot", {
		name: e,
		children: r
	}) : /* @__PURE__ */ u(l, { children: Ne(n) ? n : r });
}
function Le({ actions: e = 2, vibrate: t, leftControl: n, hooks: i = {}, children: o, container: s, className: c, style: f }) {
	let p = a(null), m = a(i);
	m.current = i;
	let g = M(s), _ = T(Te, Pe, g), v = Ie(t), y = oe(n), b = Me(o);
	r(() => {
		let e = N(s, p.current) ?? p.current;
		if (!e) return;
		let t = (t, n) => {
			S(v), m.current[t]?.(e), E(e, n, { controller: e });
		}, n = async () => {
			try {
				document.fullscreenElement === e ? await document.exitFullscreen() : (await e.requestFullscreen(), await P());
			} catch {}
		}, r = (e) => () => {
			t(e, h.gameController.dpad[e]);
		}, i = (e) => () => {
			t(e, h.gameController.action[e]);
		}, a = () => {
			t("fullscreen", h.gameController.ancillary.fullscreen), n();
		}, o = () => t("select", h.gameController.ancillary.select), c = () => t("start", h.gameController.ancillary.start), l = () => S(v), u = [
			[h.gcDpad.up, r("up")],
			[h.gcDpad.down, r("down")],
			[h.gcDpad.left, r("left")],
			[h.gcDpad.right, r("right")],
			[h.gcFace.a, i("a")],
			[h.gcFace.b, i("b")],
			[h.gcFace.x, i("x")],
			[h.gcFace.y, i("y")],
			[h.gcAncillary.fullscreen, a],
			[h.gcAncillary.select, o],
			[h.gcAncillary.start, c],
			[h.gcJoystick.pointerDown, l],
			...Object.values(h.gcJoystick.cardinal).map((e) => [e, l])
		];
		for (let [t, n] of u) e.addEventListener(t, n);
		return () => {
			for (let [t, n] of u) e.removeEventListener(t, n);
		};
	}, [s, v]);
	let x = [g ? void 0 : Pe, c].filter(Boolean).join(" "), C = /* @__PURE__ */ u("div", {
		className: "gamecontroller__shell",
		children: /* @__PURE__ */ d("div", {
			className: "gamecontroller__container",
			children: [/* @__PURE__ */ d("div", {
				className: "gamecontroller__center",
				children: [/* @__PURE__ */ u("div", {
					className: "gamecontroller__stage",
					children: /* @__PURE__ */ u($, {
						name: Z.stage,
						inShadow: g,
						assigned: b.stage,
						fallback: null
					})
				}), /* @__PURE__ */ u("div", {
					className: "gamecontroller__ancillaries",
					children: /* @__PURE__ */ u($, {
						name: Z.ancillaries,
						inShadow: g,
						assigned: b.ancillaries,
						fallback: /* @__PURE__ */ u(R, {})
					})
				})]
			}), /* @__PURE__ */ d("div", {
				className: "gamecontroller__main-controls",
				children: [/* @__PURE__ */ u("div", {
					className: "gamecontroller__d-pad-container",
					children: /* @__PURE__ */ u($, {
						name: Z.leftControl,
						inShadow: g,
						assigned: b.leftControl,
						fallback: y === "joystick" ? /* @__PURE__ */ u(Y, { emitCardinal: !0 }) : /* @__PURE__ */ u(H, {})
					})
				}), /* @__PURE__ */ u("div", {
					className: "gamecontroller__actions",
					children: /* @__PURE__ */ u($, {
						name: Z.actions,
						inShadow: g,
						assigned: b.actions,
						fallback: /* @__PURE__ */ u(W, { actions: e })
					})
				})]
			})]
		})
	});
	return /* @__PURE__ */ d(l, { children: [/* @__PURE__ */ u("style", { children: _ }), x ? /* @__PURE__ */ u("div", {
		ref: p,
		className: x,
		style: f,
		children: C
	}) : /* @__PURE__ */ u("div", {
		ref: p,
		style: { display: "contents" },
		children: C
	})] });
}
var Re = Object.assign(Le, {
	Stage: De,
	Ancillaries: Oe,
	LeftControl: ke,
	Actions: Ae
});
Le.displayName = "GameController";
var ze = A(Re, {
	props: {
		actions: "number",
		vibrate: "boolean",
		leftControl: "string"
	},
	objectProps: ["hooks"]
});
j(Fe, ze);
//#endregion
//#region src/index.ts
var Be = ze;
//#endregion
export { G as DEFAULT_JOYSTICK_SECTORS, h as EVENTS, Z as GAME_CONTROLLER_SLOTS, Re as GameController, Ae as GameControllerActions, Oe as GameControllerAncillaries, ze as GameControllerElement, ke as GameControllerLeftControlSlot, De as GameControllerStage, R as GcAncillaryButtons, z as GcAncillaryButtonsElement, H as GcDpad, U as GcDpadElement, W as GcFaceButtons, le as GcFaceButtonsElement, Y as GcJoystick, X as GcJoystickElement, _ as SB_GAME_CONTROLLER_EVENTS, b as SB_GC_ANCILLARY_EVENTS, v as SB_GC_DPAD_EVENTS, y as SB_GC_FACE_EVENTS, x as SB_GC_JOYSTICK_EVENTS, Be as default, g as gcJoystickClockHourEvent, m as getDemoCapabilityStatus, p as isFullscreenSupported, f as isHapticsSupported };
