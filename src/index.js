function addVibrations() {
  const buttons = document.querySelectorAll(
    ".game-controller__Container button"
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

// TODO: refactor to use
// DocumentFragments, eventListeners for hooks, custom events, render Attributes, custom button text
class GameController {
  constructor(query, config) {
    this.root = document.querySelector(query);
    this.actions = config?.actions || 2;
    this.refs = {};
  }

  createContainer() {
    this.refs.container = createElement({
      type: "div",
      attributes: [["classes", ["game-controller__container"]]],
    });
  }

  createStage() {
    this.refs.stage = createElement({
      type: "div",
      attributes: [["classes", ["game-controller__stage"]]],
    });
  }

  createAncillaries() {
    this.refs.ancillaries = {
      container: createElement({
        type: "div",
        attributes: [["classes", ["game-controller__ancillaries"]]],
      }),
      fullscreen: createElement({
        type: "button",
        attributes: [
          ["classes", ["game-controller__ancillary-btn"]],
          ["type", "button"],
          ["id", "fullscreen"],
        ],
        text: "fullscreen",
      }),
      select: createElement({
        type: "button",
        attributes: [
          ["classes", ["game-controller__ancillary-btn"]],
          ["type", "button"],
        ],
        text: "select",
      }),
      start: createElement({
        type: "button",
        attributes: [
          ["classes", ["game-controller__ancillary-btn"]],
          ["type", "button"],
        ],
        text: "start",
      }),
    };
  }

  createMainControlsContainer() {
    this.refs.mainControls = createElement({
      type: "div",
      attributes: [["classes", ["game-controller__main-controls"]]],
    });
  }

  createDPad() {
    this.refs.dpad = {
      container: createElement({
        type: "div",
        attributes: [["classes", ["game-controller__d-pad-container"]]],
      }),
      up: createElement({
        type: "button",
        attributes: [
          [
            "classes",
            ["game-controller__d-pad-btn", "game-controller__d-pad-btn--up"],
          ],
        ],
      }),
      right: createElement({
        type: "button",
        attributes: [
          [
            "classes",
            ["game-controller__d-pad-btn", "game-controller__d-pad-btn--right"],
          ],
        ],
      }),
      down: createElement({
        type: "button",
        attributes: [
          [
            "classes",
            ["game-controller__d-pad-btn", "game-controller__d-pad-btn--down"],
          ],
        ],
      }),
      left: createElement({
        type: "button",
        attributes: [
          [
            "classes",
            ["game-controller__d-pad-btn", "game-controller__d-pad-btn--left"],
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
              "game-controller__action-btn",
              `game-controller__action-btn--${i + 1}`,
            ],
          ],
        ],
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
            "game-controller__actions",
            `${
              this.actions === 2
                ? "game-controller__actions--two"
                : "game-controller__actions--four"
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
  }

  // render() {
  //   return `<div class="game-controller__Container">
  //     <div class="game-controller__stage"></div>
  //     <div class="game-controller__ancillaries">
  //       <button type="button" id="fullscreen">fullscreen</buttontype>
  //       <button type="button">Select</button>
  //       <button type="button">Start</button>
  //     </div>
  //     <div class="game-controller__main-controls">
  //       <div class="game-controller__d-pad-container">
  //         <button
  //           type="button"
  //           class="
  //             game-controller__d-pad-button game-controller__d-pad-button--up
  //           "
  //         ></button>
  //         <button
  //           type="button"
  //           class="
  //             game-controller__d-pad-button game-controller__d-pad-button--left
  //           "
  //         ></button>
  //         <button
  //           type="button"
  //           class="
  //             game-controller__d-pad-button game-controller__d-pad-button--right
  //           "
  //         ></button>
  //         <button
  //           type="button"
  //           class="
  //             game-controller__d-pad-button game-controller__d-pad-button--down
  //           "
  //         ></button>
  //       </div>
  //       ${this.renderActions()}
  //     </div>
  //   </div>`;
  // }
}

var actions = 2;
function createController() {
  const controller = new GameController("#app", { actions });
  const app = document.getElementById("app");
  app.innerHTML = "";
  controller.render();
  addVibrations();
  document
    .getElementById("fullscreen")
    .addEventListener("click", toggleFullscreen);
  document
    .querySelector(".game-controller__stage")
    .addEventListener("click", function () {
      console.log("click");
      if (actions == 2) {
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
