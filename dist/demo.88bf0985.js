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
})({"lCt4Z":[function(require,module,exports) {
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "4a236f9275d0a351";
module.bundle.HMR_BUNDLE_ID = "1354bb6d88bf0985";
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

},{}],"c6koc":[function(require,module,exports) {
"use strict";
var _main = _interopRequireDefault(require("./../dist/main.js"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var actions = 2;
function createController() {
    var controller = new _main.default("#app", {
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

},{"./../dist/main.js":"ec82p"}],"ec82p":[function(require,module,exports) {
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
function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") _typeof = function _typeof(obj) {
        return typeof obj;
    };
    else _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    return _typeof(obj);
}
!function(t, e) {
    "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "object" == (typeof module === "undefined" ? "undefined" : _typeof(module)) ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) ? exports.GamController = e() : t.GamController = e();
}(self, function() {
    return (function() {
        var t = {
            981: function _(t, e, n) {
                var r = n(81), o = n.n(r), i = n(645), a = n.n(i)()(o());
                a.push([
                    t.id,
                    ".gamecontroller__container{height:100vh;width:100vw;max-height:100vh;max-width:100vw;overflow:hidden;display:flex;flex-direction:column;justify-content:space-around;align-items:center}.gamecontroller__stage{border:2px solid;min-height:40vh;width:90vw;justify-self:flex-start;position:relative;z-index:999}.gamecontroller__main-controls{width:100%;display:flex;margin-bottom:20%}.gamecontroller__d-pad-container{align-self:flex-start;justify-self:flex-start;display:flex;flex-wrap:wrap;width:45%;justify-content:space-between;margin-left:2.5%;margin-top:2%}.gamecontroller__d-pad-btn{margin-bottom:5%}.gamecontroller__d-pad-btn--up{height:66px;width:25%;margin-left:38%;margin-right:38%}.gamecontroller__d-pad-btn--right{width:38%;height:33px}.gamecontroller__d-pad-btn--down{height:66px;width:25%;margin-left:38%;margin-right:38%}.gamecontroller__d-pad-btn--left{width:38%;height:33px}.gamecontroller__ancillaries{width:100%;display:flex;justify-content:center;align-items:center}.gamecontroller__ancillaries button{margin:5%;padding:1% 5%}.gamecontroller__actions{width:45%;display:flex;flex-direction:column-reverse;justify-content:center}.gamecontroller__action-btn{width:50px;height:50px;border-radius:50%}.gamecontroller__action-btn--2{margin-left:calc(50% - 50px)}.gamecontroller__action-btn--1{margin-left:auto}.gamecontroller__actions--four{margin-left:5%;flex-wrap:wrap;flex-direction:column;justify-content:initial}.gamecontroller__actions--four .gamecontroller__action-btn--1{margin-left:calc(50% - 12.5px)}.gamecontroller__actions--four .gamecontroller__action-btn--3{margin-left:auto;margin-top:-50px}.gamecontroller__actions--four .gamecontroller__action-btn--4{margin-left:calc(50% - 12.5px);margin-bottom:30%}@media screen and (orientation: landscape){.gamecontroller__container{flex-direction:row;flex-wrap:wrap;position:relative}.gamecontroller__stage{width:50%;height:90vh;top:1vh;position:absolute;left:27%}.gamecontroller__main-controls{width:100%;position:absolute;top:0;left:0;padding-top:33vh}.gamecontroller__d-pad-container{width:25%;margin-left:1%}.gamecontroller__actions{width:25%;margin-left:auto;margin-right:1%}.gamecontroller__ancillaries{width:100%;bottom:0;position:absolute;height:9vh;z-index:99}.gamecontroller__ancillaries button{margin:0 1%;padding:.25% 5%}.gamecontroller__d-pad-btn{margin-bottom:5%}.gamecontroller__d-pad-btn--up{height:66px;width:25%;margin-left:38%;margin-right:38%}.gamecontroller__d-pad-btn--right{width:38%;height:33px}.gamecontroller__d-pad-btn--down{height:66px;width:25%;margin-left:38%;margin-right:38%}.gamecontroller__d-pad-btn--left{width:38%;height:33px}.gamecontroller__actions--four .gamecontroller__action-btn--1{margin-left:calc(50% - 6.25px)}.gamecontroller__actions--four .gamecontroller__action-btn--2{margin-right:auto}.gamecontroller__actions--four .gamecontroller__action-btn--3{margin-left:auto}.gamecontroller__actions--four .gamecontroller__action-btn--4{margin-left:calc(50% - 6.25px)}}",
                    ""
                ]), e.Z = a;
            },
            645: function _(t) {
                t.exports = function(t) {
                    var e = [];
                    return e.toString = function() {
                        return this.map(function(e) {
                            var n = "", r = void 0 !== e[5];
                            return e[4] && (n += "@supports (".concat(e[4], ") {")), e[2] && (n += "@media ".concat(e[2], " {")), r && (n += "@layer".concat(e[5].length > 0 ? " ".concat(e[5]) : "", " {")), n += t(e), r && (n += "}"), e[2] && (n += "}"), e[4] && (n += "}"), n;
                        }).join("");
                    }, e.i = function(t, n, r, o, i) {
                        "string" == typeof t && (t = [
                            [
                                null,
                                t,
                                void 0
                            ]
                        ]);
                        var a = {
                        };
                        if (r) for(var l = 0; l < this.length; l++){
                            var s = this[l][0];
                            null != s && (a[s] = !0);
                        }
                        for(var c = 0; c < t.length; c++){
                            var d = [].concat(t[c]);
                            r && a[d[0]] || (void 0 !== i && (void 0 === d[5] || (d[1] = "@layer".concat(d[5].length > 0 ? " ".concat(d[5]) : "", " {").concat(d[1], "}")), d[5] = i), n && (d[2] ? (d[1] = "@media ".concat(d[2], " {").concat(d[1], "}"), d[2] = n) : d[2] = n), o && (d[4] ? (d[1] = "@supports (".concat(d[4], ") {").concat(d[1], "}"), d[4] = o) : d[4] = "".concat(o)), e.push(d));
                        }
                    }, e;
                };
            },
            81: function _(t) {
                t.exports = function(t) {
                    return t[1];
                };
            },
            379: function _(t) {
                var e = [];
                function n(t) {
                    for(var n = -1, r = 0; r < e.length; r++)if (e[r].identifier === t) {
                        n = r;
                        break;
                    }
                    return n;
                }
                function r(t, r) {
                    for(var i = {
                    }, a = [], l = 0; l < t.length; l++){
                        var s = t[l], c = r.base ? s[0] + r.base : s[0], d = i[c] || 0, u = "".concat(c, " ").concat(d);
                        i[c] = d + 1;
                        var h = n(u), f = {
                            css: s[1],
                            media: s[2],
                            sourceMap: s[3],
                            supports: s[4],
                            layer: s[5]
                        };
                        if (-1 !== h) e[h].references++, e[h].updater(f);
                        else {
                            var p = o(f, r);
                            r.byIndex = l, e.splice(l, 0, {
                                identifier: u,
                                updater: p,
                                references: 1
                            });
                        }
                        a.push(u);
                    }
                    return a;
                }
                function o(t, e) {
                    var n = e.domAPI(e);
                    n.update(t);
                    return function(e) {
                        if (e) {
                            if (e.css === t.css && e.media === t.media && e.sourceMap === t.sourceMap && e.supports === t.supports && e.layer === t.layer) return;
                            n.update(t = e);
                        } else n.remove();
                    };
                }
                t.exports = function(t, o) {
                    var i = r(t = t || [], o = o || {
                    });
                    return function(t) {
                        t = t || [];
                        for(var a = 0; a < i.length; a++){
                            var l = n(i[a]);
                            e[l].references--;
                        }
                        for(var s = r(t, o), c = 0; c < i.length; c++){
                            var d = n(i[c]);
                            0 === e[d].references && (e[d].updater(), e.splice(d, 1));
                        }
                        i = s;
                    };
                };
            },
            569: function _(t3) {
                var e = {
                };
                t3.exports = function(t2, n) {
                    var r = function(t) {
                        if (void 0 === e[t]) {
                            var n = document.querySelector(t);
                            if (window.HTMLIFrameElement && n instanceof window.HTMLIFrameElement) try {
                                n = n.contentDocument.head;
                            } catch (t1) {
                                n = null;
                            }
                            e[t] = n;
                        }
                        return e[t];
                    }(t2);
                    if (!r) throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
                    r.appendChild(n);
                };
            },
            216: function _(t) {
                t.exports = function(t) {
                    var e = document.createElement("style");
                    return t.setAttributes(e, t.attributes), t.insert(e, t.options), e;
                };
            },
            565: function _(t, e, n) {
                t.exports = function(t) {
                    var e = n.nc;
                    e && t.setAttribute("nonce", e);
                };
            },
            795: function _(t) {
                t.exports = function(t) {
                    var e = t.insertStyleElement(t);
                    return {
                        update: function update(n) {
                            !function(t, e, n) {
                                var r = "";
                                n.supports && (r += "@supports (".concat(n.supports, ") {")), n.media && (r += "@media ".concat(n.media, " {"));
                                var o = void 0 !== n.layer;
                                o && (r += "@layer".concat(n.layer.length > 0 ? " ".concat(n.layer) : "", " {")), r += n.css, o && (r += "}"), n.media && (r += "}"), n.supports && (r += "}");
                                var i = n.sourceMap;
                                i && "undefined" != typeof btoa && (r += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(i)))), " */")), e.styleTagTransform(r, t, e.options);
                            }(e, t, n);
                        },
                        remove: function remove() {
                            !function(t) {
                                if (null === t.parentNode) return !1;
                                t.parentNode.removeChild(t);
                            }(e);
                        }
                    };
                };
            },
            589: function _(t) {
                t.exports = function(t, e) {
                    if (e.styleSheet) e.styleSheet.cssText = t;
                    else {
                        for(; e.firstChild;)e.removeChild(e.firstChild);
                        e.appendChild(document.createTextNode(t));
                    }
                };
            }
        }, e = {
        };
        function n(r) {
            var o = e[r];
            if (void 0 !== o) return o.exports;
            var i = e[r] = {
                id: r,
                exports: {
                }
            };
            return t[r](i, i.exports, n), i.exports;
        }
        n.n = function(t) {
            var e = t && t.__esModule ? function() {
                return t.default;
            } : function() {
                return t;
            };
            return n.d(e, {
                a: e
            }), e;
        }, n.d = function(t, e) {
            for(var r in e)n.o(e, r) && !n.o(t, r) && Object.defineProperty(t, r, {
                enumerable: !0,
                get: e[r]
            });
        }, n.o = function(t, e) {
            return Object.prototype.hasOwnProperty.call(t, e);
        }, n.r = function(t) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
                value: "Module"
            }), Object.defineProperty(t, "__esModule", {
                value: !0
            });
        };
        var r = {
        };
        return (function() {
            n.r(r), n.d(r, {
                default: function _default() {
                    return y;
                }
            });
            var t = n(379), e = n.n(t), o = n(795), i = n.n(o), a = n(569), l = n.n(a), s = n(565), c = n.n(s), d = n(216), u = n.n(d), h = n(589), f = n.n(h), p = n(981), m = {
            };
            m.styleTagTransform = f(), m.setAttributes = c(), m.insert = l().bind(null, "head"), m.domAPI = i(), m.insertStyleElement = u();
            e()(p.Z, m), p.Z && p.Z.locals && p.Z.locals;
            function g(t) {
                var _t$attributes, _this = this;
                var e = document.createElement(t.type);
                return (_t$attributes = t.attributes) !== null && _t$attributes !== void 0 && _t$attributes.forEach(function(t) {
                    var _e$classList;
                    "classes" === t[0] ? (_e$classList = e.classList).add.apply(_e$classList, _toConsumableArray(t[1])) : e.setAttribute(t[0], t[1]);
                }), e.textContent = t.text, t.ref && (this.refs[t.ref] = e), t.children && t.children.forEach(function(t) {
                    e.appendChild(g.call(_this, t));
                }), e;
            }
            function _(t, e) {
                window.dispatchEvent(new CustomEvent(t, {
                    detail: _objectSpread(_objectSpread({
                    }, e), {
                    }, {
                        controller: this
                    }),
                    bubbles: !0
                }));
            }
            var b = {
                1: "Y",
                2: "X",
                3: "B",
                4: "A"
            }, v = {
                1: "A",
                2: "B"
            };
            var y = /*#__PURE__*/ function() {
                function y(_t, _e) {
                    var _this2 = this;
                    _classCallCheck(this, y);
                    _defineProperty(this, "attachEventHandlers", function() {
                        _this2.refs.ancillaries.fullscreen.addEventListener("click", function() {
                            _this2.hooks.fullscreen && _this2.hooks.fullscreen(_this2), _this2.vibrate && navigator.vibrate(10), _this2.fullscreen = !_this2.fullscreen, _this2.fullscreen ? _this2.openFullscreen() : _this2.closeFullscreen(), _.call(_this2, "gamecontroller:ancillary:fullscreen");
                        }), _this2.refs.ancillaries.select.addEventListener("click", function() {
                            _this2.hooks.select && _this2.hooks.select(_this2), _this2.vibrate && navigator.vibrate(10), _.call(_this2, "gamecontroller:ancillary:select");
                        }), _this2.refs.ancillaries.start.addEventListener("click", function() {
                            _this2.hooks.start && _this2.hooks.start(_this2), _this2.vibrate && navigator.vibrate(10), _.call(_this2, "gamecontroller:ancillary:start");
                        }), _this2.refs.dpad.up.addEventListener("click", function() {
                            _this2.hooks.up && _this2.hooks.up(_this2), _this2.vibrate && navigator.vibrate(10), _.call(_this2, "gamecontroller:dpad:up");
                        }), _this2.refs.dpad.right.addEventListener("click", function() {
                            _this2.hooks.right && _this2.hooks.right(_this2), _this2.vibrate && navigator.vibrate(10), _.call(_this2, "gamecontroller:dpad:right");
                        }), _this2.refs.dpad.down.addEventListener("click", function() {
                            _this2.hooks.down && _this2.hooks.down(_this2), _this2.vibrate && navigator.vibrate(10), _.call(_this2, "gamecontroller:dpad:down");
                        }), _this2.refs.dpad.left.addEventListener("click", function() {
                            _this2.hooks.left && _this2.hooks.left(_this2), _this2.vibrate && navigator.vibrate(10), _.call(_this2, "gamecontroller:dpad:left");
                        }), _this2.refs.actions.buttons.forEach(function(t, e) {
                            t.addEventListener("click", function() {
                                var t = 2 === _this2.actions ? v[e + 1] : b[e + 1];
                                _this2.hooks[t] && _this2.hooks[t](_this2), _this2.vibrate && navigator.vibrate(10), _.call(_this2, "gamecontroller:action:".concat(2 === _this2.actions ? v[e + 1] : b[e + 1]));
                            });
                        });
                    });
                    _defineProperty(this, "closeFullscreen", function() {
                        document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen ? document.webkitExitFullscreen() : document.msExitFullscreen && document.msExitFullscreen();
                    });
                    _defineProperty(this, "openFullscreen", function() {
                        _this2.document.requestFullscreen ? _this2.document.requestFullscreen() : _this2.document.webkitRequestFullscreen ? _this2.document.webkitRequestFullscreen() : _this2.document.msRequestFullscreen && _this2.document.msRequestFullscreen();
                    });
                    this.root = document.querySelector(_t), this.actions = (_e === null || _e === void 0 ? void 0 : _e.actions) || 2, this.refs = {
                    }, this.hooks = _e.hooks || {
                    }, this.vibrate = _e.vibrate || !0, this.fullscreen = !1, this.document = document.documentElement;
                }
                _createClass(y, [
                    {
                        key: "render",
                        value: function render() {
                            var _this3 = this;
                            this.root.appendChild(g.call(this, {
                                type: "div",
                                attributes: [
                                    [
                                        "classes",
                                        [
                                            "gamecontroller__container"
                                        ]
                                    ]
                                ],
                                children: [
                                    {
                                        type: "div",
                                        attributes: [
                                            [
                                                "classes",
                                                [
                                                    "gamecontroller__stage"
                                                ]
                                            ]
                                        ],
                                        ref: "stage"
                                    },
                                    {
                                        type: "div",
                                        attributes: [
                                            [
                                                "classes",
                                                [
                                                    "gamecontroller__ancillaries"
                                                ]
                                            ]
                                        ],
                                        children: [
                                            {
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
                                                text: "fullscreen",
                                                ref: "fullscreenBtn"
                                            },
                                            {
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
                                                text: "select",
                                                ref: "selectBtn"
                                            },
                                            {
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
                                                text: "start",
                                                ref: "startBtn"
                                            }
                                        ]
                                    },
                                    {
                                        type: "div",
                                        attributes: [
                                            [
                                                "classes",
                                                [
                                                    "gamecontroller__main-controls"
                                                ]
                                            ]
                                        ],
                                        children: [
                                            {
                                                type: "div",
                                                attributes: [
                                                    [
                                                        "classes",
                                                        [
                                                            "gamecontroller__d-pad-container"
                                                        ]
                                                    ]
                                                ],
                                                children: [
                                                    {
                                                        type: "button",
                                                        attributes: [
                                                            [
                                                                "classes",
                                                                [
                                                                    "gamecontroller__d-pad-btn",
                                                                    "gamecontroller__d-pad-btn--up"
                                                                ]
                                                            ]
                                                        ],
                                                        ref: "upBtn"
                                                    },
                                                    {
                                                        type: "button",
                                                        attributes: [
                                                            [
                                                                "classes",
                                                                [
                                                                    "gamecontroller__d-pad-btn",
                                                                    "gamecontroller__d-pad-btn--left"
                                                                ]
                                                            ]
                                                        ],
                                                        ref: "leftBtn"
                                                    },
                                                    {
                                                        type: "button",
                                                        attributes: [
                                                            [
                                                                "classes",
                                                                [
                                                                    "gamecontroller__d-pad-btn",
                                                                    "gamecontroller__d-pad-btn--right"
                                                                ]
                                                            ]
                                                        ],
                                                        ref: "rightBtn"
                                                    },
                                                    {
                                                        type: "button",
                                                        attributes: [
                                                            [
                                                                "classes",
                                                                [
                                                                    "gamecontroller__d-pad-btn",
                                                                    "gamecontroller__d-pad-btn--down"
                                                                ]
                                                            ]
                                                        ],
                                                        ref: "downBtn"
                                                    }
                                                ]
                                            },
                                            {
                                                type: "div",
                                                attributes: [
                                                    [
                                                        "classes",
                                                        [
                                                            "gamecontroller__actions",
                                                            "" + (2 === this.actions ? "gamecontroller__actions--two" : "gamecontroller__actions--four")
                                                        ]
                                                    ]
                                                ],
                                                children: new Array(this.actions).fill().map(function(t, e) {
                                                    return {
                                                        type: "button",
                                                        attributes: [
                                                            [
                                                                "classes",
                                                                [
                                                                    "gamecontroller__action-btn",
                                                                    "gamecontroller__action-btn--".concat(e + 1)
                                                                ]
                                                            ]
                                                        ],
                                                        text: 2 === _this3.actions ? v[e + 1] : b[e + 1],
                                                        ref: "".concat(2 === _this3.actions ? v[e + 1] : b[e + 1], "btn")
                                                    };
                                                })
                                            }
                                        ]
                                    }
                                ],
                                ref: "container"
                            }));
                        }
                    }
                ]);
                return y;
            }();
        })(), r;
    })();
});

},{}]},["lCt4Z","c6koc"], "c6koc", "parcelRequire4b79")

//# sourceMappingURL=demo.88bf0985.js.map
