import "./index.scss";

interface IEl {
  type: string;
  attributes: string[][];
  ref: string;
  text: string;
  children: IEl[];
}

function createElement(obj: IEl): HTMLElement {
  const el = document.createElement(obj.type);
  obj.attributes?.forEach((attrTuple: any) => {
    if (attrTuple[0] === "classes") {
      el.classList.add(...attrTuple[1]);
    } else {
      el.setAttribute(attrTuple[0], attrTuple[1]);
    }
  });
  el.textContent = obj.text;
  if (obj.ref) {
    this.refs[obj.ref] = el;
  }
  if (obj.children) {
    obj.children.forEach((child) => {
      el.appendChild(createElement.call(this, child));
    });
  }

  return el;
}

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

  attachEventHandlers = () => {
    this.refs.fullscreenBtn.addEventListener("click", () => {
      this.hooks.fullscreen ? this.hooks.fullscreen(this) : null;
      this.vibrate ? navigator.vibrate(10) : null;
      this.fullscreen = !this.fullscreen;
      this.fullscreen ? this.openFullscreen() : this.closeFullscreen();
      emitEvent.call(this, "gamecontroller:ancillary:fullscreen");
    });
    this.refs.selectBtn.addEventListener("click", () => {
      this.hooks.select ? this.hooks.select(this) : null;
      this.vibrate ? navigator.vibrate(10) : null;
      emitEvent.call(this, "gamecontroller:ancillary:select");
    });
    this.refs.startBtn.addEventListener("click", () => {
      this.hooks.start ? this.hooks.start(this) : null;
      this.vibrate ? navigator.vibrate(10) : null;
      emitEvent.call(this, "gamecontroller:ancillary:start");
    });
    this.refs.upBtn.addEventListener("click", () => {
      this.hooks.up ? this.hooks.up(this) : null;
      this.vibrate ? navigator.vibrate(10) : null;
      emitEvent.call(this, "gamecontroller:dpad:up");
    });
    this.refs.rightBtn.addEventListener("click", () => {
      this.hooks.right ? this.hooks.right(this) : null;
      this.vibrate ? navigator.vibrate(10) : null;
      emitEvent.call(this, "gamecontroller:dpad:right");
    });
    this.refs.downBtn.addEventListener("click", () => {
      this.hooks.down ? this.hooks.down(this) : null;
      this.vibrate ? navigator.vibrate(10) : null;
      emitEvent.call(this, "gamecontroller:dpad:down");
    });
    this.refs.leftBtn.addEventListener("click", () => {
      this.hooks.left ? this.hooks.left(this) : null;
      this.vibrate ? navigator.vibrate(10) : null;
      emitEvent.call(this, "gamecontroller:dpad:left");
    });

    // FIXME: should dynamically search ref object for action buttons
    // this.refs.actions.buttons.forEach((btn, i) => {
    //   btn.addEventListener("click", () => {
    //     const name = this.actions === 2 ? _2_TEXT[i + 1] : _4_TEXT[i + 1];
    //     this.hooks[name] ? this.hooks[name](this) : null;
    //     this.vibrate ? navigator.vibrate(10) : null;
    //     emitEvent.call(
    //       this,
    //       `gamecontroller:action:${
    //         this.actions === 2 ? _2_TEXT[i + 1] : _4_TEXT[i + 1]
    //       }`
    //     );
    //   });
    // });
  };

  closeFullscreen = () => {
    document.exitFullscreen();
  };

  openFullscreen = () => {
    this.document.requestFullscreen();
  };

  render() {
    this.root.appendChild(
      createElement.call(this, {
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
                ref: "fullscreenBtn",
              },
              {
                type: "button",
                attributes: [
                  ["classes", ["gamecontroller__ancillary-btn"]],
                  ["type", "button"],
                ],
                text: "select",
                ref: "selectBtn",
              },
              {
                type: "button",
                attributes: [
                  ["classes", ["gamecontroller__ancillary-btn"]],
                  ["type", "button"],
                ],
                text: "start",
                ref: "startBtn",
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
                    ref: "upBtn",
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
                    ref: "leftBtn",
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
                    ref: "rightBtn",
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
                    ref: "downBtn",
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
                    text: this.actions === 2 ? _2_TEXT[i + 1] : _4_TEXT[i + 1],
                    ref: `${
                      this.actions === 2 ? _2_TEXT[i + 1] : _4_TEXT[i + 1]
                    }btn`,
                  };
                }),
              },
            ],
          },
        ],
        ref: "container",
      })
    );
  }
}
