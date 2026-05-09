import { LitElement as e, css as t, html as n, unsafeCSS as r } from "lit";
//#region src/events.ts
var i = {
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
function a(e) {
	return `${i.gcJoystick.clock}:${e}`;
}
var o = [
	...Object.values(i.gameController.ancillary),
	...Object.values(i.gameController.dpad),
	...Object.values(i.gameController.action),
	...Object.values(i.gcDpad),
	...Object.values(i.gcAncillary),
	...Object.values(i.gcFace)
], s = Object.values(i.gcDpad), c = Object.values(i.gcFace), l = Object.values(i.gcAncillary), u = [
	i.gcJoystick.move,
	i.gcJoystick.sector,
	i.gcJoystick.clock,
	...Array.from({ length: 12 }, (e, t) => a(t + 1)),
	...Object.values(i.gcJoystick.cardinal)
], d = "/**\n * Standalone ancillary row (fullscreen / select / start). `var(--gc-*, fallback)` matches\n * `<game-controller>` defaults for Storybook / embeds; inherited tokens override when set.\n */\n:host {\n  display: block;\n  width: 100%;\n  box-sizing: border-box;\n  color: var(--gc-color-text, #000000);\n  font-family: var(--gc-font-family, system-ui, sans-serif);\n}\n\n:host *,\n:host *::before,\n:host *::after {\n  box-sizing: inherit;\n}\n\n.gcancillary {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  flex-wrap: wrap;\n  width: 100%;\n}\n\n.gcancillary__btn {\n  margin: var(--gc-ancillary-margin, 5%);\n  padding: var(--gc-ancillary-padding, 1% 5%);\n  font-family: inherit;\n  font-size: var(--gc-ancillary-font-size, 0.8rem);\n  background: var(--gc-ancillary-btn-bg, transparent);\n  color: var(--gc-ancillary-btn-color, #000000);\n  border: var(--gc-ancillary-btn-border, 1px solid #000000);\n  border-radius: var(--gc-ancillary-btn-border-radius, 6px);\n}\n\n.gcancillary__btn:focus {\n  outline: none;\n}\n\n.gcancillary__btn:focus-visible {\n  outline: var(--gc-focus-ring, 2px solid #000000);\n  outline-offset: 2px;\n}\n", f = "gc-ancillary-buttons", p = class extends e {
	static {
		this.styles = t`
    ${r(d)}
  `;
	}
	emitPress(e) {
		this.dispatchEvent(new CustomEvent(i.gcAncillary[e], {
			detail: {
				controller: this,
				id: e
			},
			bubbles: !0,
			composed: !0
		}));
	}
	render() {
		return n`
      <div class="gcancillary" part="row">
        <button
          type="button"
          class="gcancillary__btn"
          part="btn-fullscreen"
          id="fullscreen"
          @click=${() => this.emitPress("fullscreen")}
        >
          fullscreen
        </button>
        <button
          type="button"
          class="gcancillary__btn"
          part="btn-select"
          @click=${() => this.emitPress("select")}
        >
          select
        </button>
        <button
          type="button"
          class="gcancillary__btn"
          part="btn-start"
          @click=${() => this.emitPress("start")}
        >
          start
        </button>
      </div>
    `;
	}
};
customElements.get(f) || customElements.define(f, p);
//#endregion
//#region src/components/gc-dpad/gc-dpad.css?raw
var m = "/**\n * D-pad shell. Inherits `--gc-dpad-*` from ancestors (e.g. `<game-controller>`).\n * Standalone defaults match neutral monochrome (transparent pads, black borders).\n */\n:host {\n  display: block;\n  width: 100%;\n  box-sizing: border-box;\n\n  --gc-dpad-axis: 66px;\n  --gc-dpad-half: 33px;\n  --gc-dpad-btn-bg: transparent;\n  --gc-dpad-btn-color: transparent;\n  --gc-dpad-btn-border-width: 1px;\n  --gc-dpad-btn-border-style: solid;\n  --gc-dpad-btn-border-color: #000000;\n  --gc-dpad-btn-border: var(--gc-dpad-btn-border-width) var(--gc-dpad-btn-border-style)\n    var(--gc-dpad-btn-border-color);\n  --gc-dpad-btn-border-radius: 4px;\n\n  --gc-focus-ring-width: 2px;\n  --gc-focus-ring-style: solid;\n  --gc-focus-ring-color: #000000;\n  --gc-focus-ring: var(--gc-focus-ring-width) var(--gc-focus-ring-style) var(--gc-focus-ring-color);\n}\n\n:host *,\n:host *::before,\n:host *::after {\n  box-sizing: inherit;\n}\n\n.gcdpad {\n  display: flex;\n  flex-wrap: wrap;\n  width: 100%;\n  justify-content: space-between;\n}\n\n.gcdpad__btn {\n  margin-bottom: 5%;\n  background: var(--gc-dpad-btn-bg);\n  color: var(--gc-dpad-btn-color);\n  border: var(--gc-dpad-btn-border);\n  border-radius: var(--gc-dpad-btn-border-radius);\n  cursor: pointer;\n}\n\n.gcdpad__btn--up {\n  background: var(--gc-dpad-btn-up-bg, var(--gc-dpad-btn-bg));\n  color: var(--gc-dpad-btn-up-color, var(--gc-dpad-btn-color));\n  border: var(--gc-dpad-btn-up-border, var(--gc-dpad-btn-border));\n  height: var(--gc-dpad-axis);\n  width: 25%;\n  margin-left: 38%;\n  margin-right: 38%;\n}\n\n.gcdpad__btn--right {\n  background: var(--gc-dpad-btn-right-bg, var(--gc-dpad-btn-bg));\n  color: var(--gc-dpad-btn-right-color, var(--gc-dpad-btn-color));\n  border: var(--gc-dpad-btn-right-border, var(--gc-dpad-btn-border));\n  width: 38%;\n  height: var(--gc-dpad-half);\n}\n\n.gcdpad__btn--down {\n  background: var(--gc-dpad-btn-down-bg, var(--gc-dpad-btn-bg));\n  color: var(--gc-dpad-btn-down-color, var(--gc-dpad-btn-color));\n  border: var(--gc-dpad-btn-down-border, var(--gc-dpad-btn-border));\n  height: var(--gc-dpad-axis);\n  width: 25%;\n  margin-left: 38%;\n  margin-right: 38%;\n}\n\n.gcdpad__btn--left {\n  background: var(--gc-dpad-btn-left-bg, var(--gc-dpad-btn-bg));\n  color: var(--gc-dpad-btn-left-color, var(--gc-dpad-btn-color));\n  border: var(--gc-dpad-btn-left-border, var(--gc-dpad-btn-border));\n  width: 38%;\n  height: var(--gc-dpad-half);\n}\n\n.gcdpad__btn:focus {\n  outline: none;\n}\n\n.gcdpad__btn:focus-visible {\n  outline: var(--gc-focus-ring);\n  outline-offset: 2px;\n}\n", h = class extends e {
	static {
		this.styles = t`
    ${r(m)}
  `;
	}
	emitDirection(e) {
		this.dispatchEvent(new CustomEvent(i.gcDpad[e], {
			detail: {
				controller: this,
				direction: e
			},
			bubbles: !0,
			composed: !0
		}));
	}
	render() {
		return n`
      <div class="gcdpad" part="base">
        <button
          type="button"
          class="gcdpad__btn gcdpad__btn--up"
          aria-label="Up"
          part="btn-up"
          @click=${() => this.emitDirection("up")}
        ></button>
        <button
          type="button"
          class="gcdpad__btn gcdpad__btn--left"
          aria-label="Left"
          part="btn-left"
          @click=${() => this.emitDirection("left")}
        ></button>
        <button
          type="button"
          class="gcdpad__btn gcdpad__btn--right"
          aria-label="Right"
          part="btn-right"
          @click=${() => this.emitDirection("right")}
        ></button>
        <button
          type="button"
          class="gcdpad__btn gcdpad__btn--down"
          aria-label="Down"
          part="btn-down"
          @click=${() => this.emitDirection("down")}
        ></button>
      </div>
    `;
	}
}, g = "gc-dpad";
customElements.get(g) || customElements.define(g, h);
//#endregion
//#region src/components/game-controller/game-controller-layout.ts
var _ = [
	"y",
	"x",
	"b",
	"a"
], v = ["a", "b"];
function y(e) {
	return e === 2 ? v : _;
}
function b(e) {
	return e === 2 ? "gcface__actions gcface__actions--two" : "gcface__actions gcface__actions--four";
}
//#endregion
//#region src/components/gc-face-buttons/gc-face-buttons.css?raw
var x = "/**\n * Face / action buttons (A/B or Y/X/B/A). `var(--gc-*, fallback)` uses the same defaults as\n * `<game-controller>` so Storybook / embeds work without a shell; inherited tokens from an\n * ancestor still override when set.\n */\n:host {\n  display: block;\n  width: 100%;\n  box-sizing: border-box;\n  color: var(--gc-color-text, #000000);\n  font-family: var(--gc-font-family, system-ui, sans-serif);\n}\n\n:host *,\n:host *::before,\n:host *::after {\n  box-sizing: inherit;\n}\n\n.gcface__actions {\n  width: 100%;\n  display: flex;\n  flex-direction: column-reverse;\n  justify-content: flex-end;\n}\n\n.gcface__btn {\n  width: var(--gc-action-size, 50px);\n  height: var(--gc-action-size, 50px);\n  font-family: inherit;\n  font-size: var(--gc-action-font-size, 0.75rem);\n  font-weight: 600;\n  border-radius: var(--gc-action-btn-border-radius, 50%);\n}\n\n.gcface__btn:focus {\n  outline: none;\n}\n\n.gcface__btn:focus-visible {\n  outline: var(--gc-focus-ring, 2px solid #000000);\n  outline-offset: 2px;\n}\n\n.gcface__btn--1 {\n  margin-left: auto;\n  background: var(--gc-action-btn-1-bg, var(--gc-action-btn-bg, #ffffff));\n  color: var(--gc-action-btn-1-color, var(--gc-action-btn-color, #000000));\n  border: var(--gc-action-btn-1-border, var(--gc-action-btn-border, 1px solid #000000));\n}\n\n.gcface__btn--2 {\n  margin-left: calc(50% - var(--gc-action-size, 50px));\n  background: var(--gc-action-btn-2-bg, var(--gc-action-btn-bg, #ffffff));\n  color: var(--gc-action-btn-2-color, var(--gc-action-btn-color, #000000));\n  border: var(--gc-action-btn-2-border, var(--gc-action-btn-border, 1px solid #000000));\n}\n\n.gcface__btn--3 {\n  background: var(--gc-action-btn-3-bg, var(--gc-action-btn-bg, #ffffff));\n  color: var(--gc-action-btn-3-color, var(--gc-action-btn-color, #000000));\n  border: var(--gc-action-btn-3-border, var(--gc-action-btn-border, 1px solid #000000));\n}\n\n.gcface__btn--4 {\n  background: var(--gc-action-btn-4-bg, var(--gc-action-btn-bg, #ffffff));\n  color: var(--gc-action-btn-4-color, var(--gc-action-btn-color, #000000));\n  border: var(--gc-action-btn-4-border, var(--gc-action-btn-border, 1px solid #000000));\n}\n\n.gcface__actions--four {\n  margin-left: 5%;\n  flex-wrap: wrap;\n  flex-direction: column;\n  justify-content: initial;\n}\n\n.gcface__actions--four .gcface__btn--1 {\n  margin-left: calc(50% - var(--gc-action-size, 50px) / 4);\n}\n\n.gcface__actions--four .gcface__btn--3 {\n  margin-left: auto;\n  margin-top: calc(-1 * var(--gc-action-size, 50px));\n}\n\n.gcface__actions--four .gcface__btn--4 {\n  margin-left: calc(50% - var(--gc-action-size, 50px) / 4);\n  margin-bottom: 30%;\n}\n\n/** Landscape viewport: diamond margins match `<game-controller>` landscape flex row. */\n@media (orientation: landscape) {\n  .gcface__actions--four .gcface__btn--1 {\n    margin-left: calc(50% - var(--gc-action-size, 50px) / 8);\n  }\n\n  .gcface__actions--four .gcface__btn--2 {\n    margin-right: auto;\n  }\n\n  .gcface__actions--four .gcface__btn--3 {\n    margin-left: auto;\n  }\n\n  .gcface__actions--four .gcface__btn--4 {\n    margin-left: calc(50% - var(--gc-action-size, 50px) / 8);\n  }\n}\n", S = "gc-face-buttons", C = class extends e {
	constructor(...e) {
		super(...e), this.actions = 2;
	}
	static {
		this.styles = t`
    ${r(x)}
  `;
	}
	static {
		this.properties = { actions: { type: Number } };
	}
	emitFace(e) {
		this.dispatchEvent(new CustomEvent(i.gcFace[e], {
			detail: {
				controller: this,
				button: e
			},
			bubbles: !0,
			composed: !0
		}));
	}
	render() {
		let e = y(this.actions);
		return n`
      <div class="${b(this.actions)}" part="actions">
        ${e.map((e, t) => n`
            <button
              type="button"
              class="gcface__btn gcface__btn--${t + 1}"
              part="btn-${e}"
              @click=${() => this.emitFace(e)}
            >
              ${e.toUpperCase()}
            </button>
          `)}
      </div>
    `;
	}
};
customElements.get(S) || customElements.define(S, C);
//#endregion
//#region src/components/gc-joystick/gc-joystick.css?raw
var w = ":host {\n  display: block;\n  width: 100%;\n  max-width: 140px;\n  aspect-ratio: 1;\n  box-sizing: border-box;\n\n  --gc-joystick-ring-bg: transparent;\n  --gc-joystick-ring-border-width: 1px;\n  --gc-joystick-ring-border-color: #000000;\n  --gc-joystick-ring-border: var(--gc-joystick-ring-border-width) solid\n    var(--gc-joystick-ring-border-color);\n\n  --gc-joystick-knob-bg: #ffffff;\n  --gc-joystick-knob-border: 1px solid #000000;\n  --gc-joystick-knob-size: 28px;\n\n  --gc-focus-ring-width: 2px;\n  --gc-focus-ring-style: solid;\n  --gc-focus-ring-color: #000000;\n  --gc-focus-ring: var(--gc-focus-ring-width) var(--gc-focus-ring-style) var(--gc-focus-ring-color);\n}\n\n:host *,\n:host *::before,\n:host *::after {\n  box-sizing: inherit;\n}\n\n.gcjoystick {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  touch-action: none;\n}\n\n.gcjoystick__ring {\n  position: absolute;\n  inset: 0;\n  border-radius: 50%;\n  background: var(--gc-joystick-ring-bg);\n  border: var(--gc-joystick-ring-border);\n}\n\n.gcjoystick__knob {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  width: var(--gc-joystick-knob-size);\n  height: var(--gc-joystick-knob-size);\n  border-radius: 50%;\n  background: var(--gc-joystick-knob-bg);\n  border: var(--gc-joystick-knob-border);\n  cursor: grab;\n  box-shadow: none;\n}\n\n.gcjoystick__knob:active {\n  cursor: grabbing;\n}\n\n.gcjoystick__knob:focus {\n  outline: none;\n}\n\n.gcjoystick__knob:focus-visible {\n  outline: var(--gc-focus-ring);\n  outline-offset: 2px;\n}\n", T = [
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
function E(e) {
	let t = e % 360;
	return t < 0 && (t += 360), t;
}
function D(e, t) {
	return E(Math.atan2(e, -t) * 180 / Math.PI);
}
function O(e, t, n) {
	let r = E(e), i = E(t), a = E(n);
	return i <= a ? r >= i && r <= a : r >= i || r <= a;
}
function k(e, t) {
	for (let n of e) if (O(t, n.startDeg, n.endDeg)) return n.id;
	return null;
}
function A(e) {
	let t = E(e);
	return t >= 315 || t < 45 ? "up" : t < 135 ? "right" : t < 225 ? "down" : "left";
}
function j(e) {
	let t = E(e + 15), n = Math.floor(t / 30);
	return n === 0 ? 12 : n;
}
function M(e) {
	return `${e}-oclock`;
}
function N(e, t, n) {
	let r = Math.hypot(e, t);
	return r > n && r > 0 ? {
		dx: e / r * n,
		dy: t / r * n
	} : {
		dx: e,
		dy: t
	};
}
function P(e) {
	let { pointerDx: t, pointerDy: n, maxTravel: r, deadZone: i } = e, { dx: a, dy: o } = N(t, n, r), s = r > 0 ? a / r : 0, c = r > 0 ? o / r : 0, l = Math.min(1, Math.hypot(s, c));
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
		angleDeg: D(a, o)
	};
}
function F(e, t) {
	let n = e.angleDeg, r = n === null ? null : k(t, n), i = n === null ? "none" : A(n), a = n === null ? null : j(n), o = a === null ? null : M(a);
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
function I(e) {
	if (!e) return null;
	try {
		let t = JSON.parse(e);
		return !Array.isArray(t) || t.length === 0 ? null : t;
	} catch {
		return null;
	}
}
//#endregion
//#region src/components/gc-joystick/gc-joystick.ts
var L = "gc-joystick", R = class extends e {
	constructor(...e) {
		super(...e), this.deadZone = .12, this.emitCardinal = !1, this.emitClock = !1, this.emitSectors = !1, this.sectorsJson = null, this.sectors = [...T], this.dragging = !1, this.nx = 0, this.ny = 0, this.mag = 0, this.angleDeg = null, this.knobDx = 0, this.knobDy = 0, this.lastCardinal = "none", this.lastSectorId = null, this.lastClockHour = null, this.onPointerDown = (e) => {
			e.preventDefault(), this.dragging = !0, e.currentTarget.setPointerCapture(e.pointerId), this.updateStick(e.clientX, e.clientY);
		}, this.onPointerMove = (e) => {
			this.dragging && (e.preventDefault(), this.updateStick(e.clientX, e.clientY));
		}, this.onPointerUp = (e) => {
			if (this.dragging) {
				e.preventDefault();
				try {
					e.currentTarget.releasePointerCapture(e.pointerId);
				} catch {}
				this.resetStick();
			}
		}, this.onLostCapture = () => {
			this.dragging && this.resetStick();
		};
	}
	static {
		this.styles = t`
    ${r(w)}
  `;
	}
	static {
		this.properties = {
			deadZone: { type: Number },
			emitCardinal: {
				type: Boolean,
				attribute: "emit-cardinal"
			},
			emitClock: {
				type: Boolean,
				attribute: "emit-clock"
			},
			emitSectors: {
				type: Boolean,
				attribute: "emit-sectors"
			},
			sectorsJson: {
				type: String,
				attribute: "sectors-json"
			}
		};
	}
	updated(e) {
		if (super.updated(e), e.has("sectorsJson") && this.sectorsJson) {
			let e = I(this.sectorsJson);
			e && (this.sectors = e);
		}
	}
	emit(e, t) {
		this.dispatchEvent(new CustomEvent(e, {
			detail: t,
			bubbles: !0,
			composed: !0
		}));
	}
	kinState() {
		return {
			knobDx: this.knobDx,
			knobDy: this.knobDy,
			nx: this.nx,
			ny: this.ny,
			mag: this.mag,
			angleDeg: this.angleDeg
		};
	}
	buildDetail() {
		return {
			controller: this,
			...F(this.kinState(), this.sectors)
		};
	}
	emitMoveAlways() {
		let e = this.buildDetail();
		return this.emit(i.gcJoystick.move, { ...e }), e;
	}
	emitAuxiliary(e) {
		if (this.emitCardinal && e.cardinal !== this.lastCardinal) {
			let t = this.lastCardinal;
			this.lastCardinal = e.cardinal, this.emit(i.gcJoystick.cardinal[e.cardinal], {
				...e,
				previousCardinal: t
			});
		}
		if (this.emitSectors) {
			let t = e.sectorId;
			if (t !== this.lastSectorId) {
				let n = this.lastSectorId;
				this.lastSectorId = t, this.emit(i.gcJoystick.sector, {
					...e,
					previousSectorId: n
				});
			}
		}
		if (this.emitClock) {
			let t = e.clockHour;
			if (t !== this.lastClockHour) {
				let n = this.lastClockHour;
				this.lastClockHour = t, t !== null && this.emit(a(t), {
					...e,
					hour: t,
					previousHour: n
				}), this.emit(i.gcJoystick.clock, {
					...e,
					hour: t,
					previousHour: n,
					label: e.clockLabel,
					previousLabel: n === null ? null : M(n)
				});
			}
		}
	}
	knobHalfPx() {
		let e = getComputedStyle(this).getPropertyValue("--gc-joystick-knob-size").trim();
		return (Number.parseFloat(e || "28") || 28) / 2;
	}
	updateStick(e, t) {
		let n = this.renderRoot.querySelector(".gcjoystick__ring");
		if (!n) return;
		let r = n.getBoundingClientRect(), i = r.left + r.width / 2, a = r.top + r.height / 2, o = this.knobHalfPx(), s = Math.max(8, Math.min(r.width, r.height) / 2 - o - 2), c = P({
			pointerDx: e - i,
			pointerDy: t - a,
			maxTravel: s,
			deadZone: this.deadZone
		});
		this.knobDx = c.knobDx, this.knobDy = c.knobDy, this.nx = c.nx, this.ny = c.ny, this.mag = c.mag, this.angleDeg = c.angleDeg;
		let l = this.emitMoveAlways();
		this.emitAuxiliary(l), this.requestUpdate();
	}
	resetStick() {
		this.dragging = !1, this.nx = 0, this.ny = 0, this.mag = 0, this.angleDeg = null, this.knobDx = 0, this.knobDy = 0;
		let e = this.emitMoveAlways();
		if (this.emitCardinal && this.lastCardinal !== "none") {
			let t = this.lastCardinal;
			this.lastCardinal = "none", this.emit(i.gcJoystick.cardinal.none, {
				...e,
				previousCardinal: t
			});
		}
		if (this.emitSectors && this.lastSectorId !== null) {
			let t = this.lastSectorId;
			this.lastSectorId = null, this.emit(i.gcJoystick.sector, {
				...e,
				sectorId: null,
				previousSectorId: t
			});
		}
		if (this.emitClock && this.lastClockHour !== null) {
			let t = this.lastClockHour;
			this.lastClockHour = null, this.emit(i.gcJoystick.clock, {
				...e,
				hour: null,
				previousHour: t,
				label: null,
				previousLabel: t === null ? null : M(t)
			});
		}
		this.requestUpdate();
	}
	render() {
		return n`
      <div class="gcjoystick" part="base">
        <div class="gcjoystick__ring" part="ring"></div>
        <button
          type="button"
          class="gcjoystick__knob"
          part="knob"
          aria-label="Joystick"
          style="transform: ${`translate(calc(-50% + ${this.knobDx}px), calc(-50% + ${this.knobDy}px))`}"
          @pointerdown=${this.onPointerDown}
          @pointermove=${this.onPointerMove}
          @pointerup=${this.onPointerUp}
          @pointercancel=${this.onPointerUp}
          @lostpointercapture=${this.onLostCapture}
        ></button>
      </div>
    `;
	}
};
customElements.get(L) || customElements.define(L, R);
//#endregion
//#region src/components/game-controller/game-controller.css?raw
var z = "/**\n * All tokens use the `--gc-` prefix (game controller). Defaults are neutral monochrome\n * (black strokes/text, white or transparent fills). Set overrides on `<game-controller>`:\n *\n *   game-controller {\n *     --gc-shell-bg: #111;\n *     --gc-action-btn-bg: #333;\n *   }\n *\n * Layout fills the dynamic viewport (`100dvh` / `100dvw`) with safe-area insets. Portrait\n * (`orientation: portrait`): `.gamecontroller__center` (stage → ancillary), then\n * `.gamecontroller__main-controls` row (stick | face buttons). Landscape uses flex `order` +\n * `display: contents` on `.gamecontroller__main-controls` so stick | center | actions read left\n * to right. Fullscreen uses `requestFullscreen()` on `<game-controller>`.\n */\n:host {\n  display: flex;\n  flex-direction: column;\n  box-sizing: border-box;\n  width: 100%;\n  max-width: 100%;\n  /**\n   * Default fills the dynamic viewport. For embedded previews, set on an ancestor:\n   * `--gc-host-min-height: 100%` and `--gc-host-height: 100%`.\n   */\n  min-height: var(--gc-host-min-height, 100vh);\n  /* biome-ignore lint/suspicious/noDuplicateProperties: progressive enhancement */\n  min-height: var(--gc-host-min-height, 100dvh);\n  height: var(--gc-host-height, auto);\n\n  /* Typography */\n  --gc-font-family: system-ui, sans-serif;\n  --gc-color-text: #000000;\n  --gc-action-font-size: 0.75rem;\n  --gc-ancillary-font-size: 0.8rem;\n\n  /* Shell (outer device / viewport chrome) */\n  --gc-shell-bg: #ffffff;\n  --gc-shell-border-width: 0;\n  --gc-shell-border-style: solid;\n  --gc-shell-border-color: transparent;\n  --gc-shell-border: var(--gc-shell-border-width) var(--gc-shell-border-style)\n    var(--gc-shell-border-color);\n\n  /* Stage (“screen”) */\n  --gc-stage-bg: transparent;\n  --gc-stage-border-width: 1px;\n  --gc-stage-border-style: solid;\n  --gc-stage-border-color: #000000;\n  --gc-stage-border: var(--gc-stage-border-width) var(--gc-stage-border-style)\n    var(--gc-stage-border-color);\n\n  /* Control bands (behind d-pad / face buttons) */\n  --gc-main-controls-bg: transparent;\n\n  /* Face buttons (default + optional --gc-action-btn-{1-4}-* ) */\n  --gc-action-size: 50px;\n  --gc-action-btn-bg: #ffffff;\n  --gc-action-btn-color: #000000;\n  --gc-action-btn-border-width: 1px;\n  --gc-action-btn-border-style: solid;\n  --gc-action-btn-border-color: #000000;\n  --gc-action-btn-border: var(--gc-action-btn-border-width) var(--gc-action-btn-border-style)\n    var(--gc-action-btn-border-color);\n  --gc-action-btn-border-radius: 50%;\n\n  /* Ancillary row (fullscreen / select / start) */\n  --gc-ancillary-btn-bg: transparent;\n  --gc-ancillary-btn-color: #000000;\n  --gc-ancillary-btn-border-width: 1px;\n  --gc-ancillary-btn-border-style: solid;\n  --gc-ancillary-btn-border-color: #000000;\n  --gc-ancillary-btn-border: var(--gc-ancillary-btn-border-width)\n    var(--gc-ancillary-btn-border-style) var(--gc-ancillary-btn-border-color);\n  --gc-ancillary-btn-border-radius: 6px;\n  --gc-ancillary-margin: 5%;\n  --gc-ancillary-padding: 1% 5%;\n\n  /* D-pad */\n  --gc-dpad-axis: 66px;\n  --gc-dpad-half: 33px;\n  --gc-dpad-btn-bg: transparent;\n  --gc-dpad-btn-color: transparent;\n  --gc-dpad-btn-border-width: 1px;\n  --gc-dpad-btn-border-style: solid;\n  --gc-dpad-btn-border-color: #000000;\n  --gc-dpad-btn-border: var(--gc-dpad-btn-border-width) var(--gc-dpad-btn-border-style)\n    var(--gc-dpad-btn-border-color);\n  --gc-dpad-btn-border-radius: 4px;\n  --gc-dpad-axis-landscape: 66px;\n  --gc-dpad-half-landscape: 33px;\n\n  /* Focus ring (keyboard) */\n  --gc-focus-ring-width: 2px;\n  --gc-focus-ring-style: solid;\n  --gc-focus-ring-color: #000000;\n  --gc-focus-ring: var(--gc-focus-ring-width) var(--gc-focus-ring-style) var(--gc-focus-ring-color);\n\n  color: var(--gc-color-text);\n  font-family: var(--gc-font-family);\n}\n\n/* iOS Safari legacy full-height when parent chain lacks height */\n@supports (-webkit-touch-callout: none) {\n  :host {\n    min-height: var(--gc-host-min-height, -webkit-fill-available);\n  }\n}\n\n:host(:fullscreen) {\n  width: 100%;\n  height: 100%;\n  min-height: 100%;\n  max-height: 100%;\n}\n\n:host *,\n:host *::before,\n:host *::after {\n  box-sizing: inherit;\n}\n\n.gamecontroller__shell {\n  flex: 1 1 auto;\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  min-width: 0;\n  min-height: 0;\n}\n\n.gamecontroller__container {\n  flex: 1 1 auto;\n  display: flex;\n  flex-direction: column;\n  flex-wrap: nowrap;\n  justify-content: flex-start;\n  align-items: stretch;\n  width: 100%;\n  min-width: 0;\n  min-height: 0;\n  overflow: hidden;\n  padding-top: env(safe-area-inset-top, 0px);\n  padding-right: env(safe-area-inset-right, 0px);\n  padding-bottom: env(safe-area-inset-bottom, 0px);\n  padding-left: env(safe-area-inset-left, 0px);\n  background: var(--gc-shell-bg);\n  border: var(--gc-shell-border);\n}\n\n:host(:fullscreen) .gamecontroller__shell {\n  flex: 1 1 auto;\n  min-height: 0;\n}\n\n:host(:fullscreen) .gamecontroller__container {\n  min-height: 0;\n}\n\n/**\n * Screen stack: stage then ancillary row (portrait reading order; landscape this column sits\n * between stick and actions via flex order).\n */\n.gamecontroller__center {\n  display: flex;\n  flex-direction: column;\n  flex: 1 1 auto;\n  min-width: 0;\n  min-height: 0;\n}\n\n.gamecontroller__stage {\n  flex: 1 1 auto;\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n  overflow: hidden;\n  background: var(--gc-stage-bg);\n  border: var(--gc-stage-border);\n  min-height: min(40dvh, 50%);\n  width: 100%;\n  max-width: 100%;\n  position: relative;\n  z-index: 1;\n}\n\n.gamecontroller__stage ::slotted(*) {\n  flex: 1 1 auto;\n  min-height: 0;\n  min-width: 0;\n  width: 100%;\n  align-self: stretch;\n}\n\n.gamecontroller__ancillaries {\n  flex: 0 0 auto;\n  width: 100%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  flex-wrap: wrap;\n}\n\n.gamecontroller__main-controls {\n  flex: 0 0 auto;\n  width: 100%;\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  align-items: flex-end;\n  gap: 0.5rem;\n  padding: 0.75rem 2.5% 0;\n  margin-bottom: 0;\n  background: var(--gc-main-controls-bg);\n}\n\n.gamecontroller__d-pad-container {\n  flex: 0 0 auto;\n  width: 45%;\n  max-width: 50%;\n  margin-left: 0;\n  margin-top: 0;\n  align-self: flex-end;\n  display: flex;\n  align-items: flex-end;\n  justify-content: flex-start;\n  min-width: 0;\n}\n\n.gamecontroller__d-pad-container gc-joystick {\n  display: block;\n  width: 100%;\n  max-width: 140px;\n  margin-bottom: 4px;\n}\n\n.gamecontroller__ancillaries gc-ancillary-buttons {\n  display: block;\n  width: 100%;\n}\n\n.gamecontroller__d-pad-container gc-dpad {\n  display: block;\n  width: 100%;\n}\n\n.gamecontroller__actions {\n  flex: 0 0 auto;\n  width: 45%;\n  max-width: 50%;\n  align-self: flex-end;\n  margin-right: 0;\n  min-width: 0;\n}\n\n.gamecontroller__actions gc-face-buttons {\n  display: block;\n  width: 100%;\n}\n\n@media (orientation: landscape) {\n  .gamecontroller__shell {\n    --gc-dpad-axis: var(--gc-dpad-axis-landscape);\n    --gc-dpad-half: var(--gc-dpad-half-landscape);\n    --gc-ancillary-margin: 0 1%;\n    --gc-ancillary-padding: 0.25% 5%;\n  }\n\n  .gamecontroller__container {\n    flex-direction: row;\n    align-items: stretch;\n    column-gap: clamp(0.25rem, 2vmin, 0.75rem);\n    row-gap: clamp(0.25rem, 1.5vh, 0.5rem);\n  }\n\n  /**\n   * Hoist d-pad + actions to siblings of `.gamecontroller__center` so flex `order` can place:\n   * stick (1) | center column (2) | face buttons (3).\n   */\n  .gamecontroller__main-controls {\n    display: contents;\n  }\n\n  .gamecontroller__d-pad-container {\n    order: 1;\n    flex: 0 1 26%;\n    width: auto;\n    max-width: none;\n    align-self: center;\n    align-items: center;\n    justify-content: center;\n    padding: clamp(0.15rem, 1.2vmin, 0.45rem);\n  }\n\n  .gamecontroller__d-pad-container gc-joystick {\n    margin-bottom: 0;\n  }\n\n  .gamecontroller__center {\n    order: 2;\n    flex: 1 1 auto;\n    min-width: 0;\n    min-height: 0;\n    row-gap: clamp(0.25rem, 1.5vh, 0.5rem);\n  }\n\n  .gamecontroller__stage {\n    flex: 1 1 auto;\n    min-height: 0;\n    width: auto;\n    max-width: none;\n  }\n\n  .gamecontroller__ancillaries {\n    flex: 0 0 auto;\n    width: 100%;\n  }\n\n  .gamecontroller__actions {\n    order: 3;\n    flex: 0 1 26%;\n    width: auto;\n    max-width: none;\n    align-self: center;\n    align-items: center;\n    justify-content: center;\n    padding: clamp(0.15rem, 1.2vmin, 0.45rem);\n  }\n}\n", B = class extends e {
	constructor(...e) {
		super(...e), this.actions = 2, this.vibrate = !0, this.leftControl = "dpad", this.hooks = {}, this.onFullscreenChange = () => {
			this.requestUpdate();
		}, this.onGcAncillaryFullscreen = () => {
			this.handleAncillary("fullscreen", i.gameController.ancillary.fullscreen), this.toggleFullscreen();
		}, this.onGcAncillarySelect = () => {
			this.handleAncillary("select", i.gameController.ancillary.select);
		}, this.onGcAncillaryStart = () => {
			this.handleAncillary("start", i.gameController.ancillary.start);
		};
	}
	static {
		this.styles = t`
    ${r(z)}
  `;
	}
	static {
		this.properties = {
			actions: { type: Number },
			vibrate: { type: Boolean },
			hooks: {
				type: Object,
				attribute: !1
			},
			leftControl: {
				type: String,
				attribute: "left-control"
			}
		};
	}
	connectedCallback() {
		super.connectedCallback(), document.addEventListener("fullscreenchange", this.onFullscreenChange);
	}
	disconnectedCallback() {
		document.removeEventListener("fullscreenchange", this.onFullscreenChange), super.disconnectedCallback();
	}
	emit(e, t = {}) {
		this.dispatchEvent(new CustomEvent(e, {
			detail: {
				...t,
				controller: this
			},
			bubbles: !0,
			composed: !0
		}));
	}
	handleAncillary(e, t) {
		this.vibrate && navigator.vibrate?.(10), this.hooks[e]?.(this), this.emit(t);
	}
	async toggleFullscreen() {
		try {
			document.fullscreenElement === this ? await document.exitFullscreen() : await this.requestFullscreen();
		} catch {}
		this.requestUpdate();
	}
	handleAction(e) {
		this.vibrate && navigator.vibrate?.(10), this.hooks[e]?.(this), this.emit(i.gameController.action[e]);
	}
	get leftStickMode() {
		return this.leftControl === "joystick" ? "joystick" : "dpad";
	}
	dpadTemplate() {
		return n`
      <gc-dpad
        @gcdpad:up=${() => this.handleAncillary("up", i.gameController.dpad.up)}
        @gcdpad:left=${() => this.handleAncillary("left", i.gameController.dpad.left)}
        @gcdpad:right=${() => this.handleAncillary("right", i.gameController.dpad.right)}
        @gcdpad:down=${() => this.handleAncillary("down", i.gameController.dpad.down)}
      ></gc-dpad>
    `;
	}
	joystickTemplate() {
		return n`<gc-joystick></gc-joystick>`;
	}
	render() {
		return n`
      <div class="gamecontroller__shell">
        <div class="gamecontroller__container">
          <div class="gamecontroller__center">
            <div class="gamecontroller__stage">
              <slot name="stage"></slot>
            </div>
            <div class="gamecontroller__ancillaries">
              <gc-ancillary-buttons
                @gcancillary:fullscreen=${this.onGcAncillaryFullscreen}
                @gcancillary:select=${this.onGcAncillarySelect}
                @gcancillary:start=${this.onGcAncillaryStart}
              ></gc-ancillary-buttons>
            </div>
          </div>
          <div class="gamecontroller__main-controls">
            <div class="gamecontroller__d-pad-container">
              ${this.leftStickMode === "joystick" ? this.joystickTemplate() : this.dpadTemplate()}
            </div>
            <div class="gamecontroller__actions">
              <gc-face-buttons
                .actions=${this.actions}
                @gcface:a=${() => this.handleAction("a")}
                @gcface:b=${() => this.handleAction("b")}
                @gcface:x=${() => this.handleAction("x")}
                @gcface:y=${() => this.handleAction("y")}
              ></gc-face-buttons>
            </div>
          </div>
        </div>
      </div>
    `;
	}
}, V = "game-controller";
customElements.get(V) || customElements.define(V, B);
var H = B;
//#endregion
export { T as DEFAULT_JOYSTICK_SECTORS, i as EVENTS, B as GameControllerElement, p as GcAncillaryButtonsElement, h as GcDpadElement, C as GcFaceButtonsElement, R as GcJoystickElement, o as SB_GAME_CONTROLLER_EVENTS, l as SB_GC_ANCILLARY_EVENTS, s as SB_GC_DPAD_EVENTS, c as SB_GC_FACE_EVENTS, u as SB_GC_JOYSTICK_EVENTS, H as default, a as gcJoystickClockHourEvent };
