import { createElement } from "@tamb/utils";
import "./index.scss";

function emitEvent(name: string, data: object) {
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
  1: "y",
  2: "x",
  3: "b",
  4: "a",
};

const _2_TEXT = {
  1: "a",
  2: "b",
};

export default class GameController {
  root: HTMLElement;
  actions: number;
  refs: any;
  hooks: any;
  vibrate: boolean;
  fullscreen: boolean;
  document: HTMLElement;

  constructor(query: string, config: any) {
    this.root = document.querySelector(query);
    this.actions = config?.actions || 2;
    this.refs = {};
    this.hooks = config.hooks || {};
    this.vibrate = config.vibrate || true;
    this.fullscreen = false;
    this.document = document.documentElement;
  }

  handleClick = (eventName, refName) => {
    this.vibrate ? navigator.vibrate(10) : null;
    this.hooks[refName] ? this.hooks[refName](this) : null;
    emitEvent.call(this, eventName);
  };

  attachEventHandlers = () => {
    this.refs.fullscreen.addEventListener("click", () => {
      this.handleClick("gamecontroller:ancillary:fullscreen", "fullscreen");
      this.fullscreen = !this.fullscreen;
      this.fullscreen ? this.openFullscreen() : this.closeFullscreen();
    });
    this.refs.select.addEventListener("click", () => {
      this.handleClick("gamecontroller:ancillary:select", "select");
    });
    this.refs.start.addEventListener("click", () => {
      this.handleClick("gamecontroller:ancillary:start", "start");
    });
    this.refs.up.addEventListener("click", () => {
      this.handleClick("gamecontroller:dpad:up", "up");
    });
    this.refs.right.addEventListener("click", () => {
      this.handleClick("gamecontroller:dpad:right", "right");
    });
    this.refs.down.addEventListener("click", () => {
      this.handleClick("gamecontroller:dpad:down", "down");
    });
    this.refs.left.addEventListener("click", () => {
      this.handleClick("gamecontroller:dpad:left", "left");
    });

    const btns = this.actions === 2 ? _2_TEXT : _4_TEXT;
    Object.keys(btns).forEach((key, i) => {
      this.refs[`${btns[key]}`].addEventListener("click", () => {
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
    document.exitFullscreen();
  };

  openFullscreen = () => {
    this.document.requestFullscreen();
  };

  render() {
    this.root.appendChild(
      createElement.call(this.refs, {
        type: "div",
        attributes: [["classes", ["gamecontroller__container"]]],
        children: [
          {
            type: "div",
            attributes: [["classes", ["gamecontroller__stage"]]],
            ref: "stage",
          },
          {
            type: "div",
            attributes: [["classes", ["gamecontroller__ancillaries"]]],
            children: [
              {
                type: "button",
                attributes: [
                  ["classes", ["gamecontroller__ancillary-btn"]],
                  ["type", "button"],
                  ["id", "fullscreen"],
                ],
                text: "fullscreen",
                ref: "fullscreen",
              },
              {
                type: "button",
                attributes: [
                  ["classes", ["gamecontroller__ancillary-btn"]],
                  ["type", "button"],
                ],
                text: "select",
                ref: "select",
              },
              {
                type: "button",
                attributes: [
                  ["classes", ["gamecontroller__ancillary-btn"]],
                  ["type", "button"],
                ],
                text: "start",
                ref: "start",
              },
            ],
          },
          {
            type: "div",
            attributes: [["classes", ["gamecontroller__main-controls"]]],
            children: [
              {
                type: "div",
                attributes: [["classes", ["gamecontroller__d-pad-container"]]],
                children: [
                  {
                    type: "button",
                    attributes: [
                      [
                        "classes",
                        [
                          "gamecontroller__d-pad-btn",
                          "gamecontroller__d-pad-btn--up",
                        ],
                      ],
                    ],
                    ref: "up",
                  },
                  {
                    type: "button",
                    attributes: [
                      [
                        "classes",
                        [
                          "gamecontroller__d-pad-btn",
                          "gamecontroller__d-pad-btn--left",
                        ],
                      ],
                    ],
                    ref: "left",
                  },
                  {
                    type: "button",
                    attributes: [
                      [
                        "classes",
                        [
                          "gamecontroller__d-pad-btn",
                          "gamecontroller__d-pad-btn--right",
                        ],
                      ],
                    ],
                    ref: "right",
                  },
                  {
                    type: "button",
                    attributes: [
                      [
                        "classes",
                        [
                          "gamecontroller__d-pad-btn",
                          "gamecontroller__d-pad-btn--down",
                        ],
                      ],
                    ],
                    ref: "down",
                  },
                ],
              },
              {
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
                children: new Array(this.actions).fill("").map((x, i) => {
                  return {
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
                    text: (this.actions === 2
                      ? _2_TEXT[i + 1]
                      : _4_TEXT[i + 1]
                    ).toUpperCase(),
                    ref: `${
                      this.actions === 2 ? _2_TEXT[i + 1] : _4_TEXT[i + 1]
                    }`,
                  };
                }),
              },
            ],
          },
        ],
        ref: "container",
      })
    );

    this.attachEventHandlers();
  }
}
