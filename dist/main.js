import { createElement as e, useEffect as t, useMemo as n, useRef as r, useState as i } from "react";
import a from "@r2wc/core";
import { createRoot as o } from "react-dom/client";
import { Fragment as s, jsx as c, jsxs as l } from "react/jsx-runtime";
//#region src/capabilities.ts
function u(e = typeof navigator < "u" ? navigator : void 0) {
	return typeof e?.vibrate == "function";
}
function d(e = typeof document < "u" ? document : void 0, t = typeof document < "u" ? document.documentElement : void 0) {
	if (!e) return !1;
	let n = e.fullscreenEnabled ?? e.webkitFullscreenEnabled;
	return typeof n == "boolean" ? n : typeof t?.requestFullscreen == "function" || typeof t?.webkitRequestFullscreen == "function";
}
function f(e = typeof document < "u" ? document : void 0, t = typeof navigator < "u" ? navigator : void 0, n = typeof document < "u" ? document.documentElement : void 0) {
	return {
		fullscreen: d(e, n),
		haptics: u(t)
	};
}
//#endregion
//#region src/events.ts
var p = {
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
function m(e) {
	return `${p.gcJoystick.clock}:${e}`;
}
var h = [
	...Object.values(p.gameController.ancillary),
	...Object.values(p.gameController.dpad),
	...Object.values(p.gameController.action),
	...Object.values(p.gcDpad),
	...Object.values(p.gcAncillary),
	...Object.values(p.gcFace),
	p.gcJoystick.pointerDown,
	p.gcJoystick.move,
	p.gcJoystick.sector,
	p.gcJoystick.clock,
	...Object.values(p.gcJoystick.cardinal)
], g = Object.values(p.gcDpad), _ = Object.values(p.gcFace), v = Object.values(p.gcAncillary), y = [
	p.gcJoystick.pointerDown,
	p.gcJoystick.move,
	p.gcJoystick.sector,
	p.gcJoystick.clock,
	...Array.from({ length: 12 }, (e, t) => m(t + 1)),
	...Object.values(p.gcJoystick.cardinal)
];
function b(e, t = 10) {
	e && navigator.vibrate?.(t);
}
function x(e) {
	if (e === null) return !0;
	let t = e.trim().toLowerCase();
	return !(t === "false" || t === "0" || t === "off");
}
//#endregion
//#region src/lib/component-css.ts
function S(e, t) {
	let n = t.startsWith(".") ? t : `.${t}`;
	return e.replace(/:host(\([^)]+\))?/g, (e, t) => t ? `${n}${t.slice(1, -1)}` : n);
}
function C(e, t, n) {
	return n ? e : S(e, t);
}
//#endregion
//#region src/lib/dispatch-event.ts
function w(e, t, n) {
	e && e.dispatchEvent(new CustomEvent(t, {
		detail: n,
		bubbles: !0,
		composed: !0
	}));
}
//#endregion
//#region src/lib/r2wc-element.ts
var T = Symbol.for("r2wc.render"), E = Symbol.for("r2wc.props");
function D() {
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
function O(e, t) {
	for (let n of t) e.hasAttribute(n) && e.getAttribute(n) === "" && e.setAttribute(n, "true");
}
function k(t, n = {}) {
	let { objectProps: r = [], emptyBooleanAttributes: i = [], ...s } = n, c = a(t, {
		shadow: "open",
		...s
	}, {
		mount(t, n, r) {
			let i = o(t);
			return i.render(e(n, r)), {
				root: i,
				Component: n
			};
		},
		update({ root: t, Component: n }, r) {
			t.render(e(n, r));
		},
		unmount({ root: e }) {
			e.unmount();
		}
	});
	class l extends c {
		get updateComplete() {
			return D();
		}
		connectedCallback() {
			O(this, i), c.prototype.connectedCallback.call(this);
		}
	}
	for (let e of r) Object.defineProperty(l.prototype, e, {
		enumerable: !0,
		configurable: !0,
		get() {
			return this[E][e];
		},
		set(t) {
			this[E][e] = t, this[T]();
		}
	});
	return l;
}
function A(e, t) {
	customElements.get(e) || customElements.define(e, t);
}
//#endregion
//#region src/lib/shadow-host.ts
function j(e) {
	return e ? e.host instanceof HTMLElement : !1;
}
function M(e, t) {
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
async function N() {
	try {
		(globalThis.screen?.orientation)?.unlock?.();
	} catch {}
}
//#endregion
//#region src/components/gc-ancillary-buttons/gc-ancillary-buttons.css?raw
var P = "/**\n * Standalone ancillary row (fullscreen / select / start). `var(--gc-*, fallback)` matches\n * `<game-controller>` defaults for Storybook / embeds; inherited tokens override when set.\n */\n:host {\n  display: block;\n  width: 100%;\n  box-sizing: border-box;\n  color: var(--gc-color-text, #000000);\n  font-family: var(--gc-font-family, system-ui, sans-serif);\n}\n\n:host *,\n:host *::before,\n:host *::after {\n  box-sizing: inherit;\n}\n\n.gcancillary {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  flex-wrap: wrap;\n  width: 100%;\n}\n\n.gcancillary__btn {\n  margin: var(--gc-ancillary-margin, 5%);\n  padding: var(--gc-ancillary-padding, 1% 5%);\n  font-family: inherit;\n  font-size: var(--gc-ancillary-font-size, 0.8rem);\n  background: var(--gc-ancillary-btn-bg, transparent);\n  color: var(--gc-ancillary-btn-color, #000000);\n  border: var(--gc-ancillary-btn-border, 1px solid #000000);\n  border-radius: var(--gc-ancillary-btn-border-radius, 6px);\n}\n\n.gcancillary__btn:focus {\n  outline: none;\n}\n\n.gcancillary__btn:focus-visible {\n  outline: var(--gc-focus-ring, 2px solid #000000);\n  outline-offset: 2px;\n}\n", F = "gcancillary-host", I = [
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
function L({ container: e, onPress: t }) {
	let n = r(null), i = j(e), a = C(P, F, i), o = (r) => {
		let i = M(e, n.current);
		if (!i) return;
		let a = {
			controller: i,
			id: r
		};
		t?.(a), w(i, p.gcAncillary[r], a);
	};
	return /* @__PURE__ */ l(s, { children: [/* @__PURE__ */ c("style", { children: a }), /* @__PURE__ */ c("div", {
		ref: n,
		className: i ? "gcancillary" : `${F} gcancillary`,
		part: "row",
		children: I.map(({ id: e, part: t }) => /* @__PURE__ */ c("button", {
			type: "button",
			className: "gcancillary__btn",
			part: t,
			id: e === "fullscreen" ? "fullscreen" : void 0,
			onClick: () => o(e),
			children: e
		}, e))
	})] });
}
var R = k(L);
A("gc-ancillary-buttons", R);
//#endregion
//#region src/components/gc-dpad/gc-dpad.css?raw
var ee = "/**\n * D-pad shell. Inherits `--gc-dpad-*` from ancestors (e.g. `<game-controller>`).\n * Standalone defaults match neutral monochrome (transparent pads, black borders).\n */\n:host {\n  display: block;\n  width: 100%;\n  box-sizing: border-box;\n\n  --gc-dpad-axis: 66px;\n  --gc-dpad-half: 33px;\n  --gc-dpad-btn-bg: transparent;\n  --gc-dpad-btn-color: transparent;\n  --gc-dpad-btn-border-width: 1px;\n  --gc-dpad-btn-border-style: solid;\n  --gc-dpad-btn-border-color: #000000;\n  --gc-dpad-btn-border: var(--gc-dpad-btn-border-width) var(--gc-dpad-btn-border-style)\n    var(--gc-dpad-btn-border-color);\n  --gc-dpad-btn-border-radius: 4px;\n\n  --gc-focus-ring-width: 2px;\n  --gc-focus-ring-style: solid;\n  --gc-focus-ring-color: #000000;\n  --gc-focus-ring: var(--gc-focus-ring-width) var(--gc-focus-ring-style) var(--gc-focus-ring-color);\n}\n\n:host *,\n:host *::before,\n:host *::after {\n  box-sizing: inherit;\n}\n\n.gcdpad {\n  display: flex;\n  flex-wrap: wrap;\n  width: 100%;\n  justify-content: space-between;\n}\n\n.gcdpad__btn {\n  margin-bottom: 5%;\n  background: var(--gc-dpad-btn-bg);\n  color: var(--gc-dpad-btn-color);\n  border: var(--gc-dpad-btn-border);\n  border-radius: var(--gc-dpad-btn-border-radius);\n  cursor: pointer;\n}\n\n.gcdpad__btn--up {\n  background: var(--gc-dpad-btn-up-bg, var(--gc-dpad-btn-bg));\n  color: var(--gc-dpad-btn-up-color, var(--gc-dpad-btn-color));\n  border: var(--gc-dpad-btn-up-border, var(--gc-dpad-btn-border));\n  height: var(--gc-dpad-axis);\n  width: 25%;\n  margin-left: 38%;\n  margin-right: 38%;\n}\n\n.gcdpad__btn--right {\n  background: var(--gc-dpad-btn-right-bg, var(--gc-dpad-btn-bg));\n  color: var(--gc-dpad-btn-right-color, var(--gc-dpad-btn-color));\n  border: var(--gc-dpad-btn-right-border, var(--gc-dpad-btn-border));\n  width: 38%;\n  height: var(--gc-dpad-half);\n}\n\n.gcdpad__btn--down {\n  background: var(--gc-dpad-btn-down-bg, var(--gc-dpad-btn-bg));\n  color: var(--gc-dpad-btn-down-color, var(--gc-dpad-btn-color));\n  border: var(--gc-dpad-btn-down-border, var(--gc-dpad-btn-border));\n  height: var(--gc-dpad-axis);\n  width: 25%;\n  margin-left: 38%;\n  margin-right: 38%;\n}\n\n.gcdpad__btn--left {\n  background: var(--gc-dpad-btn-left-bg, var(--gc-dpad-btn-bg));\n  color: var(--gc-dpad-btn-left-color, var(--gc-dpad-btn-color));\n  border: var(--gc-dpad-btn-left-border, var(--gc-dpad-btn-border));\n  width: 38%;\n  height: var(--gc-dpad-half);\n}\n\n.gcdpad__btn:focus {\n  outline: none;\n}\n\n.gcdpad__btn:focus-visible {\n  outline: var(--gc-focus-ring);\n  outline-offset: 2px;\n}\n", z = "gcdpad-host", B = [
	"up",
	"left",
	"right",
	"down"
];
function V({ container: e, onDirection: t }) {
	let n = r(null), i = j(e), a = C(ee, z, i), o = (r) => {
		let i = M(e, n.current);
		if (!i) return;
		let a = {
			controller: i,
			direction: r
		};
		t?.(a), w(i, p.gcDpad[r], a);
	};
	return /* @__PURE__ */ l(s, { children: [/* @__PURE__ */ c("style", { children: a }), /* @__PURE__ */ c("div", {
		ref: n,
		className: i ? "gcdpad" : `${z} gcdpad`,
		part: "base",
		children: B.map((e) => /* @__PURE__ */ c("button", {
			type: "button",
			className: `gcdpad__btn gcdpad__btn--${e}`,
			"aria-label": e[0].toUpperCase() + e.slice(1),
			part: `btn-${e}`,
			onClick: () => o(e)
		}, e))
	})] });
}
var H = k(V);
A("gc-dpad", H);
//#endregion
//#region src/components/game-controller/game-controller-layout.ts
var te = [
	"y",
	"x",
	"b",
	"a"
], U = ["a", "b"];
function W(e) {
	return e === 2 ? U : te;
}
function G(e) {
	return e === 2 ? "gcface__actions gcface__actions--two" : "gcface__actions gcface__actions--four";
}
function ne(e) {
	return e === "joystick" ? "joystick" : "dpad";
}
//#endregion
//#region src/components/gc-face-buttons/gc-face-buttons.css?raw
var re = "/**\n * Face / action buttons (A/B or Y/X/B/A). `var(--gc-*, fallback)` uses the same defaults as\n * `<game-controller>` so Storybook / embeds work without a shell; inherited tokens from an\n * ancestor still override when set.\n */\n:host {\n  display: block;\n  width: 100%;\n  box-sizing: border-box;\n  color: var(--gc-color-text, #000000);\n  font-family: var(--gc-font-family, system-ui, sans-serif);\n}\n\n:host *,\n:host *::before,\n:host *::after {\n  box-sizing: inherit;\n}\n\n.gcface__actions {\n  width: 100%;\n  display: flex;\n  flex-direction: column-reverse;\n  justify-content: flex-end;\n}\n\n.gcface__btn {\n  width: var(--gc-action-size, 50px);\n  height: var(--gc-action-size, 50px);\n  font-family: inherit;\n  font-size: var(--gc-action-font-size, 0.75rem);\n  font-weight: 600;\n  border-radius: var(--gc-action-btn-border-radius, 50%);\n}\n\n.gcface__btn:focus {\n  outline: none;\n}\n\n.gcface__btn:focus-visible {\n  outline: var(--gc-focus-ring, 2px solid #000000);\n  outline-offset: 2px;\n}\n\n.gcface__btn--1 {\n  margin-left: auto;\n  background: var(--gc-action-btn-1-bg, var(--gc-action-btn-bg, #ffffff));\n  color: var(--gc-action-btn-1-color, var(--gc-action-btn-color, #000000));\n  border: var(--gc-action-btn-1-border, var(--gc-action-btn-border, 1px solid #000000));\n}\n\n.gcface__btn--2 {\n  margin-left: calc(50% - var(--gc-action-size, 50px));\n  background: var(--gc-action-btn-2-bg, var(--gc-action-btn-bg, #ffffff));\n  color: var(--gc-action-btn-2-color, var(--gc-action-btn-color, #000000));\n  border: var(--gc-action-btn-2-border, var(--gc-action-btn-border, 1px solid #000000));\n}\n\n.gcface__btn--3 {\n  background: var(--gc-action-btn-3-bg, var(--gc-action-btn-bg, #ffffff));\n  color: var(--gc-action-btn-3-color, var(--gc-action-btn-color, #000000));\n  border: var(--gc-action-btn-3-border, var(--gc-action-btn-border, 1px solid #000000));\n}\n\n.gcface__btn--4 {\n  background: var(--gc-action-btn-4-bg, var(--gc-action-btn-bg, #ffffff));\n  color: var(--gc-action-btn-4-color, var(--gc-action-btn-color, #000000));\n  border: var(--gc-action-btn-4-border, var(--gc-action-btn-border, 1px solid #000000));\n}\n\n.gcface__actions--four {\n  margin-left: 5%;\n  flex-wrap: wrap;\n  flex-direction: column;\n  justify-content: initial;\n}\n\n.gcface__actions--four .gcface__btn--1 {\n  margin-left: calc(50% - var(--gc-action-size, 50px) / 4);\n}\n\n.gcface__actions--four .gcface__btn--3 {\n  margin-left: auto;\n  margin-top: calc(-1 * var(--gc-action-size, 50px));\n}\n\n.gcface__actions--four .gcface__btn--4 {\n  margin-left: calc(50% - var(--gc-action-size, 50px) / 4);\n  margin-bottom: 30%;\n}\n\n/** Landscape viewport: diamond margins match `<game-controller>` landscape flex row. */\n@media (orientation: landscape) {\n  .gcface__actions--four .gcface__btn--1 {\n    margin-left: calc(50% - var(--gc-action-size, 50px) / 8);\n  }\n\n  .gcface__actions--four .gcface__btn--2 {\n    margin-right: auto;\n  }\n\n  .gcface__actions--four .gcface__btn--3 {\n    margin-left: auto;\n  }\n\n  .gcface__actions--four .gcface__btn--4 {\n    margin-left: calc(50% - var(--gc-action-size, 50px) / 8);\n  }\n}\n", ie = "gcface-host";
function K({ actions: e = 2, container: t, onButton: n }) {
	let i = r(null), a = j(t), o = C(re, ie, a), u = W(e), d = G(e), f = (e) => {
		let r = M(t, i.current);
		if (!r) return;
		let a = {
			controller: r,
			button: e
		};
		n?.(a), w(r, p.gcFace[e], a);
	};
	return /* @__PURE__ */ l(s, { children: [/* @__PURE__ */ c("style", { children: o }), /* @__PURE__ */ c("div", {
		ref: i,
		className: a ? d : `${ie} ${d}`,
		part: "actions",
		children: u.map((e, t) => /* @__PURE__ */ c("button", {
			type: "button",
			className: `gcface__btn gcface__btn--${t + 1}`,
			part: `btn-${e}`,
			onClick: () => f(e),
			children: e.toUpperCase()
		}, e))
	})] });
}
var ae = k(K, { props: { actions: "number" } });
A("gc-face-buttons", ae);
//#endregion
//#region src/components/gc-joystick/gc-joystick.css?raw
var oe = ":host {\n  display: block;\n  width: 100%;\n  max-width: 140px;\n  aspect-ratio: 1;\n  box-sizing: border-box;\n\n  --gc-joystick-ring-bg: transparent;\n  --gc-joystick-ring-border-width: 1px;\n  --gc-joystick-ring-border-color: #000000;\n  --gc-joystick-ring-border: var(--gc-joystick-ring-border-width) solid\n    var(--gc-joystick-ring-border-color);\n\n  --gc-joystick-knob-bg: #ffffff;\n  --gc-joystick-knob-border: 1px solid #000000;\n  --gc-joystick-knob-size: 28px;\n\n  --gc-focus-ring-width: 2px;\n  --gc-focus-ring-style: solid;\n  --gc-focus-ring-color: #000000;\n  --gc-focus-ring: var(--gc-focus-ring-width) var(--gc-focus-ring-style) var(--gc-focus-ring-color);\n}\n\n:host *,\n:host *::before,\n:host *::after {\n  box-sizing: inherit;\n}\n\n.gcjoystick {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  touch-action: none;\n}\n\n.gcjoystick__ring {\n  position: absolute;\n  inset: 0;\n  border-radius: 50%;\n  background: var(--gc-joystick-ring-bg);\n  border: var(--gc-joystick-ring-border);\n}\n\n.gcjoystick__knob {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  width: var(--gc-joystick-knob-size);\n  height: var(--gc-joystick-knob-size);\n  border-radius: 50%;\n  background: var(--gc-joystick-knob-bg);\n  border: var(--gc-joystick-knob-border);\n  cursor: grab;\n  box-shadow: none;\n}\n\n.gcjoystick__knob:active {\n  cursor: grabbing;\n}\n\n.gcjoystick__knob:focus {\n  outline: none;\n}\n\n.gcjoystick__knob:focus-visible {\n  outline: var(--gc-focus-ring);\n  outline-offset: 2px;\n}\n", q = [
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
function J(e) {
	let t = e % 360;
	return t < 0 && (t += 360), t;
}
function se(e, t) {
	return J(Math.atan2(e, -t) * 180 / Math.PI);
}
function ce(e, t, n) {
	let r = J(e), i = J(t), a = J(n);
	return i <= a ? r >= i && r <= a : r >= i || r <= a;
}
function le(e, t) {
	for (let n of e) if (ce(t, n.startDeg, n.endDeg)) return n.id;
	return null;
}
function ue(e) {
	let t = J(e);
	return t >= 315 || t < 45 ? "up" : t < 135 ? "right" : t < 225 ? "down" : "left";
}
function de(e) {
	let t = J(e + 15), n = Math.floor(t / 30);
	return n === 0 ? 12 : n;
}
function Y(e) {
	return `${e}-oclock`;
}
function fe(e, t, n) {
	let r = Math.hypot(e, t);
	return r > n && r > 0 ? {
		dx: e / r * n,
		dy: t / r * n
	} : {
		dx: e,
		dy: t
	};
}
function pe(e) {
	let { pointerDx: t, pointerDy: n, maxTravel: r, deadZone: i } = e, { dx: a, dy: o } = fe(t, n, r), s = r > 0 ? a / r : 0, c = r > 0 ? o / r : 0, l = Math.min(1, Math.hypot(s, c));
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
		angleDeg: se(a, o)
	};
}
function me(e, t) {
	let n = e.angleDeg, r = n === null ? null : le(t, n), i = n === null ? "none" : ue(n), a = n === null ? null : de(n), o = a === null ? null : Y(a);
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
function he(e) {
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
var ge = "gcjoystick-host", _e = "gc-joystick";
function X(e, t = !1) {
	return e === !0 ? !0 : e === !1 || e == null ? t : typeof e == "string" ? e === "" || /^[ty1-9]/i.test(e) : !!e;
}
function ve(e, t) {
	return e ? he(e) ?? [...q] : Array.isArray(t) && t.length > 0 ? t : [...q];
}
function Z({ deadZone: e = .12, emitCardinal: t, emitClock: a, emitSectors: o, sectorsJson: u, sectors: d, container: f, onPointerDown: h, onMove: g }) {
	let _ = r(null), v = r(null), y = r("none"), b = r(null), x = r(null), S = r(!1), [T, E] = i({
		dx: 0,
		dy: 0
	}), D = j(f), O = C(oe, ge, D), k = X(t), A = X(a), N = X(o), P = n(() => ve(u, d), [u, d]), F = () => M(f, _.current), I = (e) => e, L = (e) => {
		let t = F();
		return t ? {
			controller: t,
			...me(e, P)
		} : null;
	}, R = (e) => {
		let t = L(e);
		return t ? (g?.(t), w(t.controller, p.gcJoystick.move, { ...t }), t) : null;
	}, ee = (e) => {
		if (k && e.cardinal !== y.current) {
			let t = y.current;
			y.current = e.cardinal, w(e.controller, p.gcJoystick.cardinal[e.cardinal], {
				...e,
				previousCardinal: t
			});
		}
		if (N) {
			let t = e.sectorId;
			if (t !== b.current) {
				let n = b.current;
				b.current = t, w(e.controller, p.gcJoystick.sector, {
					...e,
					previousSectorId: n
				});
			}
		}
		if (A) {
			let t = e.clockHour;
			if (t !== x.current) {
				let n = x.current;
				x.current = t, t !== null && w(e.controller, m(t), {
					...e,
					hour: t,
					previousHour: n
				}), w(e.controller, p.gcJoystick.clock, {
					...e,
					hour: t,
					previousHour: n,
					label: e.clockLabel,
					previousLabel: n === null ? null : Y(n)
				});
			}
		}
	}, z = () => {
		let e = F() ?? _.current;
		if (!e) return 14;
		let t = getComputedStyle(e).getPropertyValue("--gc-joystick-knob-size").trim();
		return (Number.parseFloat(t || "28") || 28) / 2;
	}, B = (t, n) => {
		let r = v.current;
		if (!r) return;
		let i = r.getBoundingClientRect(), a = i.left + i.width / 2, o = i.top + i.height / 2, s = z(), c = Math.max(8, Math.min(i.width, i.height) / 2 - s - 2), l = pe({
			pointerDx: t - a,
			pointerDy: n - o,
			maxTravel: c,
			deadZone: e
		});
		E({
			dx: l.knobDx,
			dy: l.knobDy
		});
		let u = R(I(l));
		u && ee(u);
	}, V = () => {
		S.current = !1;
		let e = I({
			knobDx: 0,
			knobDy: 0,
			nx: 0,
			ny: 0,
			mag: 0,
			angleDeg: null
		});
		E({
			dx: 0,
			dy: 0
		});
		let t = R(e);
		if (t) {
			if (k && y.current !== "none") {
				let e = y.current;
				y.current = "none", w(t.controller, p.gcJoystick.cardinal.none, {
					...t,
					previousCardinal: e
				});
			}
			if (N && b.current !== null) {
				let e = b.current;
				b.current = null, w(t.controller, p.gcJoystick.sector, {
					...t,
					sectorId: null,
					previousSectorId: e
				});
			}
			if (A && x.current !== null) {
				let e = x.current;
				x.current = null, w(t.controller, p.gcJoystick.clock, {
					...t,
					hour: null,
					previousHour: e,
					label: null,
					previousLabel: e === null ? null : Y(e)
				});
			}
		}
	}, H = (e) => {
		e.preventDefault(), S.current = !0, e.currentTarget.setPointerCapture(e.pointerId);
		let t = F();
		t && (h?.({ controller: t }), w(t, p.gcJoystick.pointerDown, { controller: t })), B(e.clientX, e.clientY);
	}, te = (e) => {
		S.current && (e.preventDefault(), B(e.clientX, e.clientY));
	}, U = (e) => {
		if (S.current) {
			e.preventDefault();
			try {
				e.currentTarget.releasePointerCapture(e.pointerId);
			} catch {}
			V();
		}
	}, W = () => {
		S.current && V();
	}, G = `translate(calc(-50% + ${T.dx}px), calc(-50% + ${T.dy}px))`;
	return /* @__PURE__ */ l(s, { children: [/* @__PURE__ */ c("style", { children: O }), /* @__PURE__ */ l("div", {
		ref: _,
		className: D ? "gcjoystick" : `${ge} gcjoystick`,
		part: "base",
		"data-emit-cardinal": k ? "" : void 0,
		children: [/* @__PURE__ */ c("div", {
			ref: v,
			className: "gcjoystick__ring",
			part: "ring"
		}), /* @__PURE__ */ c("button", {
			type: "button",
			className: "gcjoystick__knob",
			part: "knob",
			"aria-label": "Joystick",
			style: { transform: G },
			onPointerDown: H,
			onPointerMove: te,
			onPointerUp: U,
			onPointerCancel: U,
			onLostPointerCapture: W
		})]
	})] });
}
var Q = k(Z, {
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
}), ye = Object.getOwnPropertyDescriptor(Q.prototype, "sectors"), be = Symbol.for("r2wc.props");
Object.defineProperty(Q.prototype, "sectors", {
	enumerable: !0,
	configurable: !0,
	get() {
		let e = this[be];
		return ve(e?.sectorsJson, e?.sectors);
	},
	set(e) {
		ye?.set?.call(this, e);
	}
}), A(_e, Q);
//#endregion
//#region src/components/game-controller/game-controller.css?raw
var xe = "/**\n * All tokens use the `--gc-` prefix (game controller). Defaults are neutral monochrome\n * (black strokes/text, white or transparent fills). Set overrides on `<game-controller>`:\n *\n *   game-controller {\n *     --gc-shell-bg: #111;\n *     --gc-action-btn-bg: #333;\n *   }\n *\n * Layout fills the dynamic viewport (`100dvh` / `100dvw`) with safe-area insets. Portrait\n * (`orientation: portrait`): `.gamecontroller__center` (stage → ancillary), then\n * `.gamecontroller__main-controls` row (stick | face buttons). Landscape uses flex `order` +\n * `display: contents` on `.gamecontroller__main-controls` so stick | center | actions read left\n * to right. Fullscreen uses `requestFullscreen()` on `<game-controller>`.\n */\n:host {\n  display: flex;\n  flex-direction: column;\n  box-sizing: border-box;\n  width: 100%;\n  max-width: 100%;\n  /**\n   * Default fills the dynamic viewport. For embedded previews, set on an ancestor:\n   * `--gc-host-min-height: 100%` and `--gc-host-height: 100%`.\n   */\n  min-height: var(--gc-host-min-height, 100vh);\n  /* biome-ignore lint/suspicious/noDuplicateProperties: progressive enhancement */\n  min-height: var(--gc-host-min-height, 100dvh);\n  height: var(--gc-host-height, auto);\n\n  /* Typography */\n  --gc-font-family: system-ui, sans-serif;\n  --gc-color-text: #000000;\n  --gc-action-font-size: 0.75rem;\n  --gc-ancillary-font-size: 0.8rem;\n\n  /* Shell (outer device / viewport chrome) */\n  --gc-shell-bg: #ffffff;\n  --gc-shell-border-width: 0;\n  --gc-shell-border-style: solid;\n  --gc-shell-border-color: transparent;\n  --gc-shell-border: var(--gc-shell-border-width) var(--gc-shell-border-style)\n    var(--gc-shell-border-color);\n\n  /* Stage (“screen”) */\n  --gc-stage-bg: transparent;\n  --gc-stage-border-width: 1px;\n  --gc-stage-border-style: solid;\n  --gc-stage-border-color: #000000;\n  --gc-stage-border: var(--gc-stage-border-width) var(--gc-stage-border-style)\n    var(--gc-stage-border-color);\n  /** Cap stage height in portrait; unset in landscape via media query. */\n  --gc-stage-max-height: 100%;\n\n  /* Control bands (behind d-pad / face buttons) */\n  --gc-main-controls-bg: transparent;\n\n  /* Face buttons (default + optional --gc-action-btn-{1-4}-* ) */\n  --gc-action-size: 50px;\n  --gc-action-btn-bg: #ffffff;\n  --gc-action-btn-color: #000000;\n  --gc-action-btn-border-width: 1px;\n  --gc-action-btn-border-style: solid;\n  --gc-action-btn-border-color: #000000;\n  --gc-action-btn-border: var(--gc-action-btn-border-width) var(--gc-action-btn-border-style)\n    var(--gc-action-btn-border-color);\n  --gc-action-btn-border-radius: 50%;\n\n  /* Ancillary row (fullscreen / select / start) */\n  --gc-ancillary-btn-bg: transparent;\n  --gc-ancillary-btn-color: #000000;\n  --gc-ancillary-btn-border-width: 1px;\n  --gc-ancillary-btn-border-style: solid;\n  --gc-ancillary-btn-border-color: #000000;\n  --gc-ancillary-btn-border: var(--gc-ancillary-btn-border-width)\n    var(--gc-ancillary-btn-border-style) var(--gc-ancillary-btn-border-color);\n  --gc-ancillary-btn-border-radius: 6px;\n  --gc-ancillary-margin: 5%;\n  --gc-ancillary-padding: 1% 5%;\n\n  /* D-pad */\n  --gc-dpad-axis: 66px;\n  --gc-dpad-half: 33px;\n  --gc-dpad-btn-bg: transparent;\n  --gc-dpad-btn-color: transparent;\n  --gc-dpad-btn-border-width: 1px;\n  --gc-dpad-btn-border-style: solid;\n  --gc-dpad-btn-border-color: #000000;\n  --gc-dpad-btn-border: var(--gc-dpad-btn-border-width) var(--gc-dpad-btn-border-style)\n    var(--gc-dpad-btn-border-color);\n  --gc-dpad-btn-border-radius: 4px;\n  --gc-dpad-axis-landscape: 66px;\n  --gc-dpad-half-landscape: 33px;\n\n  /* Focus ring (keyboard) */\n  --gc-focus-ring-width: 2px;\n  --gc-focus-ring-style: solid;\n  --gc-focus-ring-color: #000000;\n  --gc-focus-ring: var(--gc-focus-ring-width) var(--gc-focus-ring-style) var(--gc-focus-ring-color);\n\n  color: var(--gc-color-text);\n  font-family: var(--gc-font-family);\n}\n\n/* iOS Safari legacy full-height when parent chain lacks height */\n@supports (-webkit-touch-callout: none) {\n  :host {\n    min-height: var(--gc-host-min-height, -webkit-fill-available);\n  }\n}\n\n:host(:fullscreen) {\n  width: 100%;\n  height: 100%;\n  min-height: 100%;\n  max-height: 100%;\n}\n\n:host *,\n:host *::before,\n:host *::after {\n  box-sizing: inherit;\n}\n\n.gamecontroller__shell {\n  flex: 1 1 auto;\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  min-width: 0;\n  min-height: 0;\n}\n\n.gamecontroller__container {\n  flex: 1 1 auto;\n  display: flex;\n  flex-direction: column;\n  flex-wrap: nowrap;\n  justify-content: flex-start;\n  align-items: stretch;\n  width: 100%;\n  min-width: 0;\n  min-height: 0;\n  overflow: hidden;\n  padding-top: env(safe-area-inset-top, 0px);\n  padding-right: env(safe-area-inset-right, 0px);\n  padding-bottom: env(safe-area-inset-bottom, 0px);\n  padding-left: env(safe-area-inset-left, 0px);\n  background: var(--gc-shell-bg);\n  border: var(--gc-shell-border);\n}\n\n:host(:fullscreen) .gamecontroller__shell {\n  flex: 1 1 auto;\n  min-height: 0;\n}\n\n:host(:fullscreen) .gamecontroller__container {\n  min-height: 0;\n}\n\n/**\n * Screen stack: stage then ancillary row (portrait reading order; landscape this column sits\n * between stick and actions via flex order).\n */\n.gamecontroller__center {\n  display: flex;\n  flex-direction: column;\n  flex: 1 1 0;\n  min-width: 0;\n  min-height: 0;\n  overflow: hidden;\n}\n\n.gamecontroller__stage {\n  flex: 1 1 0;\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n  min-height: min(40dvh, 50%);\n  max-height: var(--gc-stage-max-height);\n  overflow: hidden;\n  background: var(--gc-stage-bg);\n  border: var(--gc-stage-border);\n  width: 100%;\n  max-width: 100%;\n  position: relative;\n  z-index: 1;\n}\n\n.gamecontroller__stage ::slotted(*),\n.gamecontroller__stage > * {\n  flex: 1 1 auto;\n  min-height: 0;\n  min-width: 0;\n  width: 100%;\n  align-self: stretch;\n  overflow: auto;\n  -webkit-overflow-scrolling: touch;\n  overscroll-behavior: contain;\n}\n\n.gamecontroller__ancillaries {\n  flex: 0 0 auto;\n  width: 100%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  flex-wrap: wrap;\n}\n\n.gamecontroller__main-controls {\n  flex: 0 0 auto;\n  width: 100%;\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  align-items: flex-end;\n  gap: 0.5rem;\n  padding: 0.75rem 2.5% 0;\n  margin-bottom: 0;\n  background: var(--gc-main-controls-bg);\n}\n\n.gamecontroller__d-pad-container {\n  flex: 0 0 auto;\n  width: 45%;\n  max-width: 50%;\n  margin-left: 0;\n  margin-top: 0;\n  align-self: flex-end;\n  display: flex;\n  align-items: flex-end;\n  justify-content: flex-start;\n  min-width: 0;\n}\n\n.gamecontroller__d-pad-container gc-joystick,\n.gamecontroller__d-pad-container .gcjoystick,\n.gamecontroller__d-pad-container .gcjoystick-host {\n  display: block;\n  width: 100%;\n  max-width: 140px;\n  margin-bottom: 4px;\n}\n\n.gamecontroller__ancillaries gc-ancillary-buttons,\n.gamecontroller__ancillaries .gcancillary,\n.gamecontroller__ancillaries .gcancillary-host {\n  display: block;\n  width: 100%;\n}\n\n.gamecontroller__d-pad-container gc-dpad,\n.gamecontroller__d-pad-container .gcdpad,\n.gamecontroller__d-pad-container .gcdpad-host {\n  display: block;\n  width: 100%;\n}\n\n.gamecontroller__actions {\n  flex: 0 0 auto;\n  width: 45%;\n  max-width: 50%;\n  align-self: flex-end;\n  margin-right: 0;\n  min-width: 0;\n}\n\n.gamecontroller__actions gc-face-buttons,\n.gamecontroller__actions .gcface-host,\n.gamecontroller__actions .gcface__actions {\n  display: block;\n  width: 100%;\n}\n\n@media (orientation: landscape) {\n  .gamecontroller__shell {\n    --gc-dpad-axis: var(--gc-dpad-axis-landscape);\n    --gc-dpad-half: var(--gc-dpad-half-landscape);\n    --gc-ancillary-margin: 0 1%;\n    --gc-ancillary-padding: 0.25% 5%;\n  }\n\n  .gamecontroller__container {\n    flex-direction: row;\n    align-items: stretch;\n    column-gap: clamp(0.25rem, 2vmin, 0.75rem);\n    row-gap: clamp(0.25rem, 1.5vh, 0.5rem);\n  }\n\n  /**\n   * Hoist d-pad + actions to siblings of `.gamecontroller__center` so flex `order` can place:\n   * stick (1) | center column (2) | face buttons (3).\n   */\n  .gamecontroller__main-controls {\n    display: contents;\n  }\n\n  .gamecontroller__d-pad-container {\n    order: 1;\n    flex: 0 1 26%;\n    width: auto;\n    max-width: none;\n    align-self: stretch;\n    align-items: center;\n    justify-content: center;\n    padding: clamp(0.15rem, 1.2vmin, 0.45rem);\n    /* `display: contents` on main-controls drops its background; paint sides instead. */\n    background: var(--gc-main-controls-bg);\n  }\n\n  .gamecontroller__d-pad-container gc-joystick,\n  .gamecontroller__d-pad-container .gcjoystick,\n  .gamecontroller__d-pad-container .gcjoystick-host {\n    margin-bottom: 0;\n    max-width: min(140px, 100%);\n  }\n\n  .gamecontroller__center {\n    order: 2;\n    flex: 1 1 0;\n    min-width: 0;\n    min-height: 0;\n    row-gap: clamp(0.25rem, 1.5vh, 0.5rem);\n    --gc-stage-max-height: none;\n  }\n\n  .gamecontroller__stage {\n    flex: 1 1 0;\n    min-height: 0;\n    max-height: none;\n    width: auto;\n    max-width: none;\n  }\n\n  .gamecontroller__ancillaries {\n    flex: 0 0 auto;\n    width: 100%;\n  }\n\n  .gamecontroller__actions {\n    order: 3;\n    flex: 0 1 26%;\n    width: auto;\n    max-width: none;\n    align-self: stretch;\n    align-items: center;\n    justify-content: center;\n    display: flex;\n    padding: clamp(0.15rem, 1.2vmin, 0.45rem);\n    background: var(--gc-main-controls-bg);\n  }\n\n  :host(:fullscreen) .gamecontroller__container {\n    /* Fullscreen + landscape: keep the three-column band edge-to-edge. */\n    min-height: 100%;\n  }\n}\n", Se = "game-controller", Ce = "game-controller";
function we(e) {
	return e === !1 ? !1 : e === !0 || e == null ? !0 : typeof e == "string" ? x(e) : !!e;
}
function Te({ actions: e = 2, vibrate: n, leftControl: i, hooks: a = {}, children: o, container: u, className: d, style: f }) {
	let m = r(null), h = j(u), g = C(xe, Se, h), _ = we(n), v = ne(i), y = () => M(u, m.current), x = (e, t = {}) => {
		let n = y();
		n && w(n, e, {
			...t,
			controller: n
		});
	}, S = (e) => {
		b(_, e);
	}, T = (e, t) => {
		S();
		let n = y();
		n && a[e]?.(n), x(t);
	}, E = async () => {
		let e = y();
		if (e) try {
			document.fullscreenElement === e ? await document.exitFullscreen() : (await e.requestFullscreen(), await N());
		} catch {}
	}, D = (e) => {
		if (e === "fullscreen") {
			T("fullscreen", p.gameController.ancillary.fullscreen), E();
			return;
		}
		if (e === "select") {
			T("select", p.gameController.ancillary.select);
			return;
		}
		T("start", p.gameController.ancillary.start);
	}, O = (e) => {
		T(e, p.gameController.action[e]);
	}, k = (e) => {
		T(e, p.gameController.dpad[e]);
	}, A = [h ? void 0 : Se, d].filter(Boolean).join(" "), P = /* @__PURE__ */ c("div", {
		className: "gamecontroller__shell",
		children: /* @__PURE__ */ l("div", {
			className: "gamecontroller__container",
			children: [/* @__PURE__ */ l("div", {
				className: "gamecontroller__center",
				children: [/* @__PURE__ */ c("div", {
					className: "gamecontroller__stage",
					children: /* @__PURE__ */ c("slot", {
						name: "stage",
						children: o
					})
				}), /* @__PURE__ */ c("div", {
					className: "gamecontroller__ancillaries",
					children: /* @__PURE__ */ c(L, { onPress: (e) => D(e.id) })
				})]
			}), /* @__PURE__ */ l("div", {
				className: "gamecontroller__main-controls",
				children: [/* @__PURE__ */ c("div", {
					className: "gamecontroller__d-pad-container",
					children: v === "joystick" ? /* @__PURE__ */ c(Z, {
						emitCardinal: !0,
						onPointerDown: () => S()
					}) : /* @__PURE__ */ c(V, { onDirection: (e) => k(e.direction) })
				}), /* @__PURE__ */ c("div", {
					className: "gamecontroller__actions",
					children: /* @__PURE__ */ c(K, {
						actions: e,
						onButton: (e) => O(e.button)
					})
				})]
			})]
		})
	});
	return t(() => {
		let e = M(u, m.current);
		if (!e || v !== "joystick") return;
		let t = () => b(_), n = Object.values(p.gcJoystick.cardinal);
		for (let r of n) e.addEventListener(r, t);
		return () => {
			for (let r of n) e.removeEventListener(r, t);
		};
	}, [
		u,
		v,
		_
	]), /* @__PURE__ */ l(s, { children: [/* @__PURE__ */ c("style", { children: g }), A ? /* @__PURE__ */ c("div", {
		ref: m,
		className: A,
		style: f,
		children: P
	}) : /* @__PURE__ */ c("div", {
		ref: m,
		style: { display: "contents" },
		children: P
	})] });
}
var $ = k(Te, {
	props: {
		actions: "number",
		vibrate: "boolean",
		leftControl: "string"
	},
	objectProps: ["hooks"]
});
A(Ce, $);
//#endregion
//#region src/index.ts
var Ee = $;
//#endregion
export { q as DEFAULT_JOYSTICK_SECTORS, p as EVENTS, Te as GameController, $ as GameControllerElement, L as GcAncillaryButtons, R as GcAncillaryButtonsElement, V as GcDpad, H as GcDpadElement, K as GcFaceButtons, ae as GcFaceButtonsElement, Z as GcJoystick, Q as GcJoystickElement, h as SB_GAME_CONTROLLER_EVENTS, v as SB_GC_ANCILLARY_EVENTS, g as SB_GC_DPAD_EVENTS, _ as SB_GC_FACE_EVENTS, y as SB_GC_JOYSTICK_EVENTS, Ee as default, m as gcJoystickClockHourEvent, f as getDemoCapabilityStatus, d as isFullscreenSupported, u as isHapticsSupported };
