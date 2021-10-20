// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function(modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x) {
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function(id, exports) {
    modules[id] = [
      function(require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function() {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function() {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"bBjqe":[function(require,module,exports) {
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "4a236f9275d0a351";
module.bundle.HMR_BUNDLE_ID = "d5258e848acb2b9a";
"use strict";
function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;
    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
        if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
            if (it) o = it;
            var i = 0;
            var F = function F() {
            };
            return {
                s: F,
                n: function n() {
                    if (i >= o.length) return {
                        done: true
                    };
                    return {
                        done: false,
                        value: o[i++]
                    };
                },
                e: function e(_e) {
                    throw _e;
                },
                f: F
            };
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true, didErr = false, err;
    return {
        s: function s() {
            it = o[Symbol.iterator]();
        },
        n: function n() {
            var step = it.next();
            normalCompletion = step.done;
            return step;
        },
        e: function e(_e2) {
            didErr = true;
            err = _e2;
        },
        f: function f() {
            try {
                if (!normalCompletion && it.return != null) it.return();
            } finally{
                if (didErr) throw err;
            }
        }
    };
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: mixed;
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
*/ var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData,
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function accept(fn) {
            this._acceptCallbacks.push(fn || function() {
            });
        },
        dispose: function dispose(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData = undefined;
}
module.bundle.Module = Module;
var checkedAssets, acceptedAssets, assetsToAccept;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
    return HMR_PORT || location.port;
} // eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == 'https:' && !/localhost|127.0.0.1|0.0.0.0/.test(hostname) ? 'wss' : 'ws';
    var ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/'); // $FlowFixMe
    ws.onmessage = function(event) {
        checkedAssets = {
        };
        acceptedAssets = {
        };
        assetsToAccept = [];
        var data = JSON.parse(event.data);
        if (data.type === 'update') {
            // Remove error overlay if there is one
            if (typeof document !== 'undefined') removeErrorOverlay();
            var assets = data.assets.filter(function(asset) {
                return asset.envHash === HMR_ENV_HASH;
            }); // Handle HMR Update
            var handled = assets.every(function(asset) {
                return asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear();
                assets.forEach(function(asset) {
                    hmrApply(module.bundle.root, asset);
                });
                for(var i = 0; i < assetsToAccept.length; i++){
                    var id = assetsToAccept[i][1];
                    if (!acceptedAssets[id]) hmrAcceptRun(assetsToAccept[i][0], id);
                }
            } else window.location.reload();
        }
        if (data.type === 'error') {
            // Log parcel errors to console
            var _iterator = _createForOfIteratorHelper(data.diagnostics.ansi), _step;
            try {
                for(_iterator.s(); !(_step = _iterator.n()).done;){
                    var ansiDiagnostic = _step.value;
                    var stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                    console.error('🚨 [parcel]: ' + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
                }
            } catch (err) {
                _iterator.e(err);
            } finally{
                _iterator.f();
            }
            if (typeof document !== 'undefined') {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html); // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    ws.onerror = function(e) {
        console.error(e.message);
    };
    ws.onclose = function() {
        console.warn('[parcel] 🚨 Connection to the HMR server was lost');
    };
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log('[parcel] ✨ Error resolved');
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    var errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    var _iterator2 = _createForOfIteratorHelper(diagnostics), _step2;
    try {
        for(_iterator2.s(); !(_step2 = _iterator2.n()).done;){
            var diagnostic = _step2.value;
            var stack = diagnostic.codeframe ? diagnostic.codeframe : diagnostic.stack;
            errorHTML += "\n      <div>\n        <div style=\"font-size: 18px; font-weight: bold; margin-top: 20px;\">\n          \uD83D\uDEA8 ".concat(diagnostic.message, "\n        </div>\n        <pre>").concat(stack, "</pre>\n        <div>\n          ").concat(diagnostic.hints.map(function(hint) {
                return '<div>💡 ' + hint + '</div>';
            }).join(''), "\n        </div>\n        ").concat(diagnostic.documentation ? "<div>\uD83D\uDCDD <a style=\"color: violet\" href=\"".concat(diagnostic.documentation, "\" target=\"_blank\">Learn more</a></div>") : '', "\n      </div>\n    ");
        }
    } catch (err) {
        _iterator2.e(err);
    } finally{
        _iterator2.f();
    }
    errorHTML += '</div>';
    overlay.innerHTML = errorHTML;
    return overlay;
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute('href', link.getAttribute('href').split('?')[0] + '?' + Date.now()); // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href = links[i].getAttribute('href');
            var hostname = getHostname();
            var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(window.location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrApply(bundle, asset) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === 'css') reloadCSS();
    else if (asset.type === 'js') {
        var deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            var fn = new Function('require', 'module', 'exports', asset.output);
            modules[asset.id] = [
                fn,
                deps
            ];
        } else if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrAcceptCheck(bundle, id, depsByBundle) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToAccept.push([
        bundle,
        id
    ]);
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) return true;
    var parents = getParents(module.bundle.root, id); // If no parents, the asset is new. Prevent reloading the page.
    if (!parents.length) return true;
    return parents.some(function(v) {
        return hmrAcceptCheck(v[0], v[1], null);
    });
}
function hmrAcceptRun(bundle, id) {
    var cached = bundle.cache[id];
    bundle.hotData = {
    };
    if (cached && cached.hot) cached.hot.data = bundle.hotData;
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData);
    });
    delete bundle.cache[id];
    bundle(id);
    cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) // $FlowFixMe[method-unbinding]
        assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
    });
    acceptedAssets[id] = true;
}

},{}],"gZmqs":[function(require,module,exports) {
"use strict";
var _index = _interopRequireDefault(require("./index"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var actions = 2;
function createController() {
    var controller = new _index.default("#app", {
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
    window.gamecontroller = controller;
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

},{"./index":"hD4hw"}],"hD4hw":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
require("./index.scss");
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
};
var GameController = /*#__PURE__*/ function() {
    function GameController(query, config) {
        var _this = this;
        _classCallCheck(this, GameController);
        _defineProperty(this, "attachEventHandlers", function() {
            _this.refs.ancillaries.fullscreen.addEventListener("click", function() {
                _this.hooks.fullscreen && _this.hooks.fullscreen(_this);
                _this.vibrate && navigator.vibrate(10);
                _this.fullscreen = !_this.fullscreen;
                _this.fullscreen ? _this.openFullscreen() : _this.closeFullscreen();
                emitEvent.call(_this, "gamecontroller:ancillary:fullscreen");
            });
            _this.refs.ancillaries.select.addEventListener("click", function() {
                _this.hooks.select && _this.hooks.select(_this);
                _this.vibrate && navigator.vibrate(10);
                emitEvent.call(_this, "gamecontroller:ancillary:select");
            });
            _this.refs.ancillaries.start.addEventListener("click", function() {
                _this.hooks.start && _this.hooks.start(_this);
                _this.vibrate && navigator.vibrate(10);
                emitEvent.call(_this, "gamecontroller:ancillary:start");
            });
            _this.refs.dpad.up.addEventListener("click", function() {
                _this.hooks.up && _this.hooks.up(_this);
                _this.vibrate && navigator.vibrate(10);
                emitEvent.call(_this, "gamecontroller:dpad:up");
            });
            _this.refs.dpad.right.addEventListener("click", function() {
                _this.hooks.right && _this.hooks.right(_this);
                _this.vibrate && navigator.vibrate(10);
                emitEvent.call(_this, "gamecontroller:dpad:right");
            });
            _this.refs.dpad.down.addEventListener("click", function() {
                _this.hooks.down && _this.hooks.down(_this);
                _this.vibrate && navigator.vibrate(10);
                emitEvent.call(_this, "gamecontroller:dpad:down");
            });
            _this.refs.dpad.left.addEventListener("click", function() {
                _this.hooks.left && _this.hooks.left(_this);
                _this.vibrate && navigator.vibrate(10);
                emitEvent.call(_this, "gamecontroller:dpad:left");
            });
            _this.refs.actions.buttons.forEach(function(btn, i) {
                btn.addEventListener("click", function() {
                    var name = _this.actions === 2 ? _2_TEXT[i + 1] : _4_TEXT[i + 1];
                    _this.hooks[name] && _this.hooks[name](_this);
                    _this.vibrate && navigator.vibrate(10);
                    emitEvent.call(_this, "gamecontroller:action:".concat(_this.actions === 2 ? _2_TEXT[i + 1] : _4_TEXT[i + 1]));
                });
            });
        });
        _defineProperty(this, "closeFullscreen", function() {
            if (document.exitFullscreen) document.exitFullscreen();
            else if (document.webkitExitFullscreen) /* Safari */ document.webkitExitFullscreen();
            else if (document.msExitFullscreen) /* IE11 */ document.msExitFullscreen();
        });
        _defineProperty(this, "openFullscreen", function() {
            if (_this.document.requestFullscreen) _this.document.requestFullscreen();
            else if (_this.document.webkitRequestFullscreen) /* Safari */ _this.document.webkitRequestFullscreen();
            else if (_this.document.msRequestFullscreen) /* IE11 */ _this.document.msRequestFullscreen();
        });
        this.root = document.querySelector(query);
        this.actions = (config === null || config === void 0 ? void 0 : config.actions) || 2;
        this.refs = {
        };
        this.hooks = config.hooks || {
        };
        this.vibrate = config.vibrate || true;
        this.fullscreen = false;
        this.document = document.documentElement;
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
exports.default = GameController;

},{"./index.scss":"hlAnh"}],"hlAnh":[function() {},{}]},["bBjqe","gZmqs"], "gZmqs", "parcelRequire4b79")

//# sourceMappingURL=index.8acb2b9a.js.map
