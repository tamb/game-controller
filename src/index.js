function addVibrations() {
  const buttons = document.querySelectorAll(
    ".gamecontroller__container button"
  );
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      navigator.vibrate(10);
    });
  });
}

function toggleFullscreen() {
  var fullscreen = false;

  var elem = document.documentElement;

  document.getElementById("fullscreen").addEventListener("click", function () {
    fullscreen = !fullscreen;
    fullscreen ? openFullscreen() : closeFullscreen();
  });

  /* View in fullscreen */
  function openFullscreen() {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE11 */
      elem.msRequestFullscreen();
    }
  }

  /* Close fullscreen */
  function closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      /* IE11 */
      document.msExitFullscreen();
    }
  }
}

//Todo - create elementCreator

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

// TODO: refactor to use
// DocumentFragments, eventListeners for hooks, custom events, render Attributes, custom button text
class GameController {
  constructor(query, config) {
    this.root = document.querySelector(query);
    this.actions = config?.actions || 2;
    this.refs = {};
    this.hooks = config.hooks || {};
  }

  attachEventHandlers = () => {
    this.refs.ancillaries.fullscreen.addEventListener("click", function () {
      this.hooks.fullscreen ? this.hooks.fullscreen(this) : null;
      emitEvent.call(this, "gamecontroller:ancillary:fullscreen");
    });
    this.refs.ancillaries.select.addEventListener("click", function () {
      this.hooks.select ? this.hooks.select(this) : null;
      emitEvent.call(this, "gamecontroller:ancillary:select");
    });
    this.refs.ancillaries.start.addEventListener("click", function () {
      this.hooks.start ? this.hooks.start(this) : null;
      emitEvent.call(this, "gamecontroller:ancillary:start");
    });
    this.refs.dpad.up.addEventListener("click", function () {
      this.hooks.up ? this.hooks.up(this) : null;
      emitEvent.call(this, "gamecontroller:dpad:up");
    });
    this.refs.dpad.right.addEventListener("click", function () {
      this.hooks.right ? this.hooks.right(this) : null;
      emitEvent.call(this, "gamecontroller:dpad:right");
    });
    this.refs.dpad.down.addEventListener("click", function () {
      this.hooks.down ? this.hooks.down(this) : null;
      emitEvent.call(this, "gamecontroller:dpad:down");
    });
    this.refs.dpad.left.addEventListener("click", function () {
      this.hooks.left ? this.hooks.left(this) : null;
      emitEvent.call(this, "gamecontroller:dpad:left");
    });

    this.refs.actions.buttons.forEach((btn, i) => {
      btn.addEventListener("click", () => {
        const name = this.actions === 2 ? _2_TEXT[i + 1] : _4_TEXT[i + 1];
        this.hooks[name] ? this.hooks[name](this) : null;
        emitEvent.call(
          this,
          `gamecontroller:action:${
            this.actions === 2 ? _2_TEXT[i + 1] : _4_TEXT[i + 1]
          }`
        );
      });
    });
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

var actions = 2;
function createController() {
  const controller = new GameController("#app", {
    actions,
    hooks: {
      X: function (self) {
        console.log("X hook", self);
      },
    },
  });
  const app = document.getElementById("app");
  app.innerHTML = "";
  controller.render();
  addVibrations();
  document
    .getElementById("fullscreen")
    .addEventListener("click", toggleFullscreen);
  document
    .querySelector(".gamecontroller__stage")
    .addEventListener("click", function () {
      console.log("click");
      if (actions === 2) {
        actions = 4;
      } else {
        actions = 2;
      }
      createController();
    });
}

document.addEventListener("DOMContentLoaded", () => {
  createController();
});
