"use strict";
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {
        };
        if (i % 2) ownKeys(Object(source), true).forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
        else if (Object.getOwnPropertyDescriptors) Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        else ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _defineProperty(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function addVibrations() {
    var buttons = document.querySelectorAll(".gamecontroller__container button");
    buttons.forEach(function(button) {
        button.addEventListener("click", function() {
            navigator.vibrate(10);
        });
    });
}
function toggleFullscreen() {
    var fullscreen = false;
    var elem = document.documentElement;
    document.getElementById("fullscreen").addEventListener("click", function() {
        fullscreen = !fullscreen;
        fullscreen ? openFullscreen() : closeFullscreen();
    });
    /* View in fullscreen */ function openFullscreen() {
        if (elem.requestFullscreen) elem.requestFullscreen();
        else if (elem.webkitRequestFullscreen) /* Safari */ elem.webkitRequestFullscreen();
        else if (elem.msRequestFullscreen) /* IE11 */ elem.msRequestFullscreen();
    }
    /* Close fullscreen */ function closeFullscreen() {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) /* Safari */ document.webkitExitFullscreen();
        else if (document.msExitFullscreen) /* IE11 */ document.msExitFullscreen();
    }
} //Todo - create elementCreator
function createElement(obj) {
    var _obj$attributes;
    var el = document.createElement(obj.type);
    (_obj$attributes = obj.attributes) === null || _obj$attributes === void 0 || _obj$attributes.forEach(function(attrTuple) {
        if (attrTuple[0] === "classes") {
            var _el$classList;
            (_el$classList = el.classList).add.apply(_el$classList, _toConsumableArray(attrTuple[1]));
        } else el.setAttribute(attrTuple[0], attrTuple[1]);
    });
    el.textContent = obj.text;
    return el;
}
function emitEvent(name, data) {
    window.dispatchEvent(new CustomEvent(name, {
        detail: _objectSpread(_objectSpread({
        }, data), {
        }, {
            controller: this
        }),
        bubbles: true
    }));
}
var _4_TEXT = {
    1: "Y",
    2: "X",
    3: "B",
    4: "A"
};
var _2_TEXT = {
    1: "A",
    2: "B"
}; // TODO: refactor to use
// DocumentFragments, eventListeners for hooks, custom events, render Attributes, custom button text
var GameController = /*#__PURE__*/ function() {
    function GameController(query, config) {
        var _this = this;
        _classCallCheck(this, GameController);
        _defineProperty(this, "attachEventHandlers", function() {
            _this.refs.ancillaries.fullscreen.addEventListener("click", function() {
                this.hooks.fullscreen && this.hooks.fullscreen(this);
                emitEvent.call(this, "gamecontroller:ancillary:fullscreen");
            });
            _this.refs.ancillaries.select.addEventListener("click", function() {
                this.hooks.select && this.hooks.select(this);
                emitEvent.call(this, "gamecontroller:ancillary:select");
            });
            _this.refs.ancillaries.start.addEventListener("click", function() {
                this.hooks.start && this.hooks.start(this);
                emitEvent.call(this, "gamecontroller:ancillary:start");
            });
            _this.refs.dpad.up.addEventListener("click", function() {
                this.hooks.up && this.hooks.up(this);
                emitEvent.call(this, "gamecontroller:dpad:up");
            });
            _this.refs.dpad.right.addEventListener("click", function() {
                this.hooks.right && this.hooks.right(this);
                emitEvent.call(this, "gamecontroller:dpad:right");
            });
            _this.refs.dpad.down.addEventListener("click", function() {
                this.hooks.down && this.hooks.down(this);
                emitEvent.call(this, "gamecontroller:dpad:down");
            });
            _this.refs.dpad.left.addEventListener("click", function() {
                this.hooks.left && this.hooks.left(this);
                emitEvent.call(this, "gamecontroller:dpad:left");
            });
            _this.refs.actions.buttons.forEach(function(btn, i) {
                btn.addEventListener("click", function() {
                    var name = _this.actions === 2 ? _2_TEXT[i + 1] : _4_TEXT[i + 1];
                    _this.hooks[name] && _this.hooks[name](_this);
                    emitEvent.call(_this, "gamecontroller:action:".concat(_this.actions === 2 ? _2_TEXT[i + 1] : _4_TEXT[i + 1]));
                });
            });
        });
        this.root = document.querySelector(query);
        this.actions = (config === null || config === void 0 ? void 0 : config.actions) || 2;
        this.refs = {
        };
        this.hooks = config.hooks || {
        };
    }
    _createClass(GameController, [
        {
            key: "createContainer",
            value: function createContainer() {
                this.refs.container = createElement({
                    type: "div",
                    attributes: [
                        [
                            "classes",
                            [
                                "gamecontroller__container"
                            ]
                        ]
                    ]
                });
            }
        },
        {
            key: "createStage",
            value: function createStage() {
                this.refs.stage = createElement({
                    type: "div",
                    attributes: [
                        [
                            "classes",
                            [
                                "gamecontroller__stage"
                            ]
                        ]
                    ]
                });
            }
        },
        {
            key: "createAncillaries",
            value: function createAncillaries() {
                this.refs.ancillaries = {
                    container: createElement({
                        type: "div",
                        attributes: [
                            [
                                "classes",
                                [
                                    "gamecontroller__ancillaries"
                                ]
                            ]
                        ]
                    }),
                    fullscreen: createElement({
                        type: "button",
                        attributes: [
                            [
                                "classes",
                                [
                                    "gamecontroller__ancillary-btn"
                                ]
                            ],
                            [
                                "type",
                                "button"
                            ],
                            [
                                "id",
                                "fullscreen"
                            ]
                        ],
                        text: "fullscreen"
                    }),
                    select: createElement({
                        type: "button",
                        attributes: [
                            [
                                "classes",
                                [
                                    "gamecontroller__ancillary-btn"
                                ]
                            ],
                            [
                                "type",
                                "button"
                            ]
                        ],
                        text: "select"
                    }),
                    start: createElement({
                        type: "button",
                        attributes: [
                            [
                                "classes",
                                [
                                    "gamecontroller__ancillary-btn"
                                ]
                            ],
                            [
                                "type",
                                "button"
                            ]
                        ],
                        text: "start"
                    })
                };
            }
        },
        {
            key: "createMainControlsContainer",
            value: function createMainControlsContainer() {
                this.refs.mainControls = createElement({
                    type: "div",
                    attributes: [
                        [
                            "classes",
                            [
                                "gamecontroller__main-controls"
                            ]
                        ]
                    ]
                });
            }
        },
        {
            key: "createDPad",
            value: function createDPad() {
                this.refs.dpad = {
                    container: createElement({
                        type: "div",
                        attributes: [
                            [
                                "classes",
                                [
                                    "gamecontroller__d-pad-container"
                                ]
                            ]
                        ]
                    }),
                    up: createElement({
                        type: "button",
                        attributes: [
                            [
                                "classes",
                                [
                                    "gamecontroller__d-pad-btn",
                                    "gamecontroller__d-pad-btn--up"
                                ]
                            ]
                        ]
                    }),
                    right: createElement({
                        type: "button",
                        attributes: [
                            [
                                "classes",
                                [
                                    "gamecontroller__d-pad-btn",
                                    "gamecontroller__d-pad-btn--right"
                                ]
                            ]
                        ]
                    }),
                    down: createElement({
                        type: "button",
                        attributes: [
                            [
                                "classes",
                                [
                                    "gamecontroller__d-pad-btn",
                                    "gamecontroller__d-pad-btn--down"
                                ]
                            ]
                        ]
                    }),
                    left: createElement({
                        type: "button",
                        attributes: [
                            [
                                "classes",
                                [
                                    "gamecontroller__d-pad-btn",
                                    "gamecontroller__d-pad-btn--left"
                                ]
                            ]
                        ]
                    })
                };
                this.refs.dpad.container.appendChild(this.refs.dpad.up);
                this.refs.dpad.container.appendChild(this.refs.dpad.left);
                this.refs.dpad.container.appendChild(this.refs.dpad.right);
                this.refs.dpad.container.appendChild(this.refs.dpad.down);
                this.refs.mainControls.appendChild(this.refs.dpad.container);
            }
        },
        {
            key: "createActions",
            value: function createActions() {
                var _this2 = this;
                this.refs.actions.buttons = new Array(this.actions).fill().map(function(x, i) {
                    return createElement({
                        type: "button",
                        attributes: [
                            [
                                "classes",
                                [
                                    "gamecontroller__action-btn",
                                    "gamecontroller__action-btn--".concat(i + 1)
                                ]
                            ]
                        ],
                        text: _this2.actions === 2 ? _2_TEXT[i + 1] : _4_TEXT[i + 1]
                    });
                });
                this.refs.actions.buttons.forEach(function(btn) {
                    _this2.refs.actions.actionsContainer.appendChild(btn);
                });
            }
        },
        {
            key: "createActionsContainer",
            value: function createActionsContainer() {
                this.refs.actions = {
                };
                this.refs.actions.actionsContainer = createElement({
                    type: "div",
                    attributes: [
                        [
                            "classes",
                            [
                                "gamecontroller__actions",
                                "".concat(this.actions === 2 ? "gamecontroller__actions--two" : "gamecontroller__actions--four")
                            ]
                        ]
                    ]
                });
            }
        },
        {
            key: "createAllElements",
            value: function createAllElements() {
                this.createContainer();
                this.createStage();
                this.createAncillaries();
                this.createMainControlsContainer();
                this.createDPad();
                this.createActionsContainer();
                this.createActions();
            }
        },
        {
            key: "insertAllElements",
            value: function insertAllElements() {
                // once all refs are made, then append in order
                this.refs.container.appendChild(this.refs.stage);
                this.refs.ancillaries.container.appendChild(this.refs.ancillaries.fullscreen);
                this.refs.ancillaries.container.appendChild(this.refs.ancillaries.select);
                this.refs.ancillaries.container.appendChild(this.refs.ancillaries.start);
                this.refs.container.appendChild(this.refs.ancillaries.container);
                this.refs.container.appendChild(this.refs.mainControls);
                this.refs.mainControls.appendChild(this.refs.actions.actionsContainer);
            }
        },
        {
            key: "render",
            value: function render() {
                this.createAllElements();
                this.insertAllElements();
                this.root.appendChild(this.refs.container);
                this.attachEventHandlers();
            }
        }
    ]);
    return GameController;
}();
var actions = 2;
function createController() {
    var controller = new GameController("#app", {
        actions: actions,
        hooks: {
            X: function X(self) {
                console.log("X hook", self);
            }
        }
    });
    var app = document.getElementById("app");
    app.innerHTML = "";
    controller.render();
    addVibrations();
    document.getElementById("fullscreen").addEventListener("click", toggleFullscreen);
    document.querySelector(".gamecontroller__stage").addEventListener("click", function() {
        console.log("click");
        if (actions === 2) actions = 4;
        else actions = 2;
        createController();
    });
}
document.addEventListener("DOMContentLoaded", function() {
    createController();
});

//# sourceMappingURL=index.017db2f2.js.map
