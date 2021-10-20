import "./index.scss";

function createElement(obj) {
  const el = document.createElement(obj.type);
  obj.attributes?.forEach((attrTuple) => {
    if (attrTuple[0] === "classes") {
      el.classList.add(...attrTuple[1]);
    } else {
      el.setAttribute(attrTuple[0], attrTuple[1]);
    }
  });
  el.textContent = obj.text;
  if (obj.children) {
    obj.children.forEach((child) => {
      el.appendChild(createElement(child));
    });
  }

  return el;
}

function emitEvent(name, data) {
  window.dispatchEvent(
    new CustomEvent(name, {
      detail: {
        ...data,
        controller: this,
      },
      bubbles: true,
    })
  );
}

const _4_TEXT = {
  1: "Y",
  2: "X",
  3: "B",
  4: "A",
};

const _2_TEXT = {
  1: "A",
  2: "B",
};

export default class GameController {
  constructor(query, config) {
    this.root = document.querySelector(query);
    this.actions = config?.actions || 2;
    this.refs = {};
    this.hooks = config.hooks || {};
    this.vibrate = config.vibrate || true;
    this.fullscreen = false;
    this.document = document.documentElement;
  }

  attachEventHandlers = () => {
    this.refs.ancillaries.fullscreen.addEventListener("click", () => {
      this.hooks.fullscreen ? this.hooks.fullscreen(this) : null;
      this.vibrate ? navigator.vibrate(10) : null;
      this.fullscreen = !this.fullscreen;
      this.fullscreen ? this.openFullscreen() : this.closeFullscreen();
      emitEvent.call(this, "gamecontroller:ancillary:fullscreen");
    });
    this.refs.ancillaries.select.addEventListener("click", () => {
      this.hooks.select ? this.hooks.select(this) : null;
      this.vibrate ? navigator.vibrate(10) : null;
      emitEvent.call(this, "gamecontroller:ancillary:select");
    });
    this.refs.ancillaries.start.addEventListener("click", () => {
      this.hooks.start ? this.hooks.start(this) : null;
      this.vibrate ? navigator.vibrate(10) : null;
      emitEvent.call(this, "gamecontroller:ancillary:start");
    });
    this.refs.dpad.up.addEventListener("click", () => {
      this.hooks.up ? this.hooks.up(this) : null;
      this.vibrate ? navigator.vibrate(10) : null;
      emitEvent.call(this, "gamecontroller:dpad:up");
    });
    this.refs.dpad.right.addEventListener("click", () => {
      this.hooks.right ? this.hooks.right(this) : null;
      this.vibrate ? navigator.vibrate(10) : null;
      emitEvent.call(this, "gamecontroller:dpad:right");
    });
    this.refs.dpad.down.addEventListener("click", () => {
      this.hooks.down ? this.hooks.down(this) : null;
      this.vibrate ? navigator.vibrate(10) : null;
      emitEvent.call(this, "gamecontroller:dpad:down");
    });
    this.refs.dpad.left.addEventListener("click", () => {
      this.hooks.left ? this.hooks.left(this) : null;
      this.vibrate ? navigator.vibrate(10) : null;
      emitEvent.call(this, "gamecontroller:dpad:left");
    });

    this.refs.actions.buttons.forEach((btn, i) => {
      btn.addEventListener("click", () => {
        const name = this.actions === 2 ? _2_TEXT[i + 1] : _4_TEXT[i + 1];
        this.hooks[name] ? this.hooks[name](this) : null;
        this.vibrate ? navigator.vibrate(10) : null;
        emitEvent.call(
          this,
          `gamecontroller:action:${
            this.actions === 2 ? _2_TEXT[i + 1] : _4_TEXT[i + 1]
          }`
        );
      });
    });
  };

  closeFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      /* IE11 */
      document.msExitFullscreen();
    }
  };

  openFullscreen = () => {
    if (this.document.requestFullscreen) {
      this.document.requestFullscreen();
    } else if (this.document.webkitRequestFullscreen) {
      /* Safari */
      this.document.webkitRequestFullscreen();
    } else if (this.document.msRequestFullscreen) {
      /* IE11 */
      this.document.msRequestFullscreen();
    }
  };

  createContainer() {
    this.refs.container = createElement({
      type: "div",
      attributes: [["classes", ["gamecontroller__container"]]],
    });
  }

  createStage() {
    this.refs.stage = createElement({
      type: "div",
      attributes: [["classes", ["gamecontroller__stage"]]],
    });
  }

  createAncillaries() {
    this.refs.ancillaries = {
      container: createElement({
        type: "div",
        attributes: [["classes", ["gamecontroller__ancillaries"]]],
      }),
      fullscreen: createElement({
        type: "button",
        attributes: [
          ["classes", ["gamecontroller__ancillary-btn"]],
          ["type", "button"],
          ["id", "fullscreen"],
        ],
        text: "fullscreen",
      }),
      select: createElement({
        type: "button",
        attributes: [
          ["classes", ["gamecontroller__ancillary-btn"]],
          ["type", "button"],
        ],
        text: "select",
      }),
      start: createElement({
        type: "button",
        attributes: [
          ["classes", ["gamecontroller__ancillary-btn"]],
          ["type", "button"],
        ],
        text: "start",
      }),
    };
  }

  createMainControlsContainer() {
    this.refs.mainControls = createElement({
      type: "div",
      attributes: [["classes", ["gamecontroller__main-controls"]]],
    });
  }

  createDPad() {
    this.refs.dpad = {
      container: createElement({
        type: "div",
        attributes: [["classes", ["gamecontroller__d-pad-container"]]],
      }),
      up: createElement({
        type: "button",
        attributes: [
          [
            "classes",
            ["gamecontroller__d-pad-btn", "gamecontroller__d-pad-btn--up"],
          ],
        ],
      }),
      right: createElement({
        type: "button",
        attributes: [
          [
            "classes",
            ["gamecontroller__d-pad-btn", "gamecontroller__d-pad-btn--right"],
          ],
        ],
      }),
      down: createElement({
        type: "button",
        attributes: [
          [
            "classes",
            ["gamecontroller__d-pad-btn", "gamecontroller__d-pad-btn--down"],
          ],
        ],
      }),
      left: createElement({
        type: "button",
        attributes: [
          [
            "classes",
            ["gamecontroller__d-pad-btn", "gamecontroller__d-pad-btn--left"],
          ],
        ],
      }),
    };

    this.refs.dpad.container.appendChild(this.refs.dpad.up);
    this.refs.dpad.container.appendChild(this.refs.dpad.left);
    this.refs.dpad.container.appendChild(this.refs.dpad.right);
    this.refs.dpad.container.appendChild(this.refs.dpad.down);
    this.refs.mainControls.appendChild(this.refs.dpad.container);
  }

  createActions() {
    this.refs.actions.buttons = new Array(this.actions).fill().map((x, i) => {
      return createElement({
        type: "button",
        attributes: [
          [
            "classes",
            [
              "gamecontroller__action-btn",
              `gamecontroller__action-btn--${i + 1}`,
            ],
          ],
        ],
        text: this.actions === 2 ? _2_TEXT[i + 1] : _4_TEXT[i + 1],
      });
    });

    this.refs.actions.buttons.forEach((btn) => {
      this.refs.actions.actionsContainer.appendChild(btn);
    });
  }

  createActionsContainer() {
    this.refs.actions = {};
    this.refs.actions.actionsContainer = createElement({
      type: "div",
      attributes: [
        [
          "classes",
          [
            "gamecontroller__actions",
            `${
              this.actions === 2
                ? "gamecontroller__actions--two"
                : "gamecontroller__actions--four"
            }`,
          ],
        ],
      ],
    });
  }

  createAllElements() {
    this.createContainer();
    this.createStage();
    this.createAncillaries();
    this.createMainControlsContainer();
    this.createDPad();
    this.createActionsContainer();
    this.createActions();
  }

  insertAllElements() {
    // once all refs are made, then append in order
    this.refs.container.appendChild(this.refs.stage);
    this.refs.ancillaries.container.appendChild(
      this.refs.ancillaries.fullscreen
    );
    this.refs.ancillaries.container.appendChild(this.refs.ancillaries.select);
    this.refs.ancillaries.container.appendChild(this.refs.ancillaries.start);
    this.refs.container.appendChild(this.refs.ancillaries.container);
    this.refs.container.appendChild(this.refs.mainControls);
    this.refs.mainControls.appendChild(this.refs.actions.actionsContainer);
  }

  render() {
    this.createAllElements();
    this.insertAllElements();
    this.root.appendChild(this.refs.container);
    this.attachEventHandlers();
  }
}
