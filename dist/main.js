!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.GamController=e():t.GamController=e()}(self,(function(){return function(){var t={907:function(t){self,t.exports=function(){"use strict";var t={d:function(e,n){for(var r in n)t.o(n,r)&&!t.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:n[r]})},o:function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r:function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}},e={};t.r(e),t.d(e,{createElement:function(){return n}});var n=function t(e){var n,r=this,o=document.createElement(e.type);return null===(n=e.attributes)||void 0===n||n.forEach((function(t){var e;"classes"===t[0]?(e=o.classList).add.apply(e,t[1]):o.setAttribute(t[0],t[1])})),o.textContent=e.text,e.ref&&(this[e.ref]=o),e.children&&e.children.forEach((function(e){o.appendChild(t.call(r,e))})),o};return e}()},981:function(t,e,n){"use strict";var r=n(81),o=n.n(r),a=n(645),i=n.n(a)()(o());i.push([t.id,".gamecontroller__container{height:100vh;width:100vw;max-height:100vh;max-width:100vw;overflow:hidden;display:flex;flex-direction:column;justify-content:space-around;align-items:center}.gamecontroller__stage{border:2px solid;min-height:40vh;width:90vw;justify-self:flex-start;position:relative;z-index:999}.gamecontroller__main-controls{width:100%;display:flex;margin-bottom:20%}.gamecontroller__d-pad-container{align-self:flex-start;justify-self:flex-start;display:flex;flex-wrap:wrap;width:45%;justify-content:space-between;margin-left:2.5%;margin-top:2%}.gamecontroller__d-pad-btn{margin-bottom:5%}.gamecontroller__d-pad-btn--up{height:66px;width:25%;margin-left:38%;margin-right:38%}.gamecontroller__d-pad-btn--right{width:38%;height:33px}.gamecontroller__d-pad-btn--down{height:66px;width:25%;margin-left:38%;margin-right:38%}.gamecontroller__d-pad-btn--left{width:38%;height:33px}.gamecontroller__ancillaries{width:100%;display:flex;justify-content:center;align-items:center}.gamecontroller__ancillaries button{margin:5%;padding:1% 5%}.gamecontroller__actions{width:45%;display:flex;flex-direction:column-reverse;justify-content:center}.gamecontroller__action-btn{width:50px;height:50px;border-radius:50%}.gamecontroller__action-btn--2{margin-left:calc(50% - 50px)}.gamecontroller__action-btn--1{margin-left:auto}.gamecontroller__actions--four{margin-left:5%;flex-wrap:wrap;flex-direction:column;justify-content:initial}.gamecontroller__actions--four .gamecontroller__action-btn--1{margin-left:calc(50% - 12.5px)}.gamecontroller__actions--four .gamecontroller__action-btn--3{margin-left:auto;margin-top:-50px}.gamecontroller__actions--four .gamecontroller__action-btn--4{margin-left:calc(50% - 12.5px);margin-bottom:30%}@media screen and (orientation: landscape){.gamecontroller__container{flex-direction:row;flex-wrap:wrap;position:relative}.gamecontroller__stage{width:50%;height:90vh;top:1vh;position:absolute;left:27%}.gamecontroller__main-controls{width:100%;position:absolute;top:0;left:0;padding-top:33vh}.gamecontroller__d-pad-container{width:25%;margin-left:1%}.gamecontroller__actions{width:25%;margin-left:auto;margin-right:1%}.gamecontroller__ancillaries{width:100%;bottom:0;position:absolute;height:9vh;z-index:99}.gamecontroller__ancillaries button{margin:0 1%;padding:.25% 5%}.gamecontroller__d-pad-btn{margin-bottom:5%}.gamecontroller__d-pad-btn--up{height:66px;width:25%;margin-left:38%;margin-right:38%}.gamecontroller__d-pad-btn--right{width:38%;height:33px}.gamecontroller__d-pad-btn--down{height:66px;width:25%;margin-left:38%;margin-right:38%}.gamecontroller__d-pad-btn--left{width:38%;height:33px}.gamecontroller__actions--four .gamecontroller__action-btn--1{margin-left:calc(50% - 6.25px)}.gamecontroller__actions--four .gamecontroller__action-btn--2{margin-right:auto}.gamecontroller__actions--four .gamecontroller__action-btn--3{margin-left:auto}.gamecontroller__actions--four .gamecontroller__action-btn--4{margin-left:calc(50% - 6.25px)}}",""]),e.Z=i},645:function(t){"use strict";t.exports=function(t){var e=[];return e.toString=function(){return this.map((function(e){var n="",r=void 0!==e[5];return e[4]&&(n+="@supports (".concat(e[4],") {")),e[2]&&(n+="@media ".concat(e[2]," {")),r&&(n+="@layer".concat(e[5].length>0?" ".concat(e[5]):""," {")),n+=t(e),r&&(n+="}"),e[2]&&(n+="}"),e[4]&&(n+="}"),n})).join("")},e.i=function(t,n,r,o,a){"string"==typeof t&&(t=[[null,t,void 0]]);var i={};if(r)for(var l=0;l<this.length;l++){var c=this[l][0];null!=c&&(i[c]=!0)}for(var s=0;s<t.length;s++){var u=[].concat(t[s]);r&&i[u[0]]||(void 0!==a&&(void 0===u[5]||(u[1]="@layer".concat(u[5].length>0?" ".concat(u[5]):""," {").concat(u[1],"}")),u[5]=a),n&&(u[2]?(u[1]="@media ".concat(u[2]," {").concat(u[1],"}"),u[2]=n):u[2]=n),o&&(u[4]?(u[1]="@supports (".concat(u[4],") {").concat(u[1],"}"),u[4]=o):u[4]="".concat(o)),e.push(u))}},e}},81:function(t){"use strict";t.exports=function(t){return t[1]}},537:function(t,e,n){"use strict";n.r(e);var r=n(379),o=n.n(r),a=n(795),i=n.n(a),l=n(569),c=n.n(l),s=n(565),u=n.n(s),d=n(216),f=n.n(d),p=n(589),m=n.n(p),g=n(981),h={};h.styleTagTransform=m(),h.setAttributes=u(),h.insert=c().bind(null,"head"),h.domAPI=i(),h.insertStyleElement=f();o()(g.Z,h);e.default=g.Z&&g.Z.locals?g.Z.locals:void 0},379:function(t){"use strict";var e=[];function n(t){for(var n=-1,r=0;r<e.length;r++)if(e[r].identifier===t){n=r;break}return n}function r(t,r){for(var a={},i=[],l=0;l<t.length;l++){var c=t[l],s=r.base?c[0]+r.base:c[0],u=a[s]||0,d="".concat(s," ").concat(u);a[s]=u+1;var f=n(d),p={css:c[1],media:c[2],sourceMap:c[3],supports:c[4],layer:c[5]};if(-1!==f)e[f].references++,e[f].updater(p);else{var m=o(p,r);r.byIndex=l,e.splice(l,0,{identifier:d,updater:m,references:1})}i.push(d)}return i}function o(t,e){var n=e.domAPI(e);n.update(t);return function(e){if(e){if(e.css===t.css&&e.media===t.media&&e.sourceMap===t.sourceMap&&e.supports===t.supports&&e.layer===t.layer)return;n.update(t=e)}else n.remove()}}t.exports=function(t,o){var a=r(t=t||[],o=o||{});return function(t){t=t||[];for(var i=0;i<a.length;i++){var l=n(a[i]);e[l].references--}for(var c=r(t,o),s=0;s<a.length;s++){var u=n(a[s]);0===e[u].references&&(e[u].updater(),e.splice(u,1))}a=c}}},569:function(t){"use strict";var e={};t.exports=function(t,n){var r=function(t){if(void 0===e[t]){var n=document.querySelector(t);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(t){n=null}e[t]=n}return e[t]}(t);if(!r)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");r.appendChild(n)}},216:function(t){"use strict";t.exports=function(t){var e=document.createElement("style");return t.setAttributes(e,t.attributes),t.insert(e,t.options),e}},565:function(t,e,n){"use strict";t.exports=function(t){var e=n.nc;e&&t.setAttribute("nonce",e)}},795:function(t){"use strict";t.exports=function(t){var e=t.insertStyleElement(t);return{update:function(n){!function(t,e,n){var r="";n.supports&&(r+="@supports (".concat(n.supports,") {")),n.media&&(r+="@media ".concat(n.media," {"));var o=void 0!==n.layer;o&&(r+="@layer".concat(n.layer.length>0?" ".concat(n.layer):""," {")),r+=n.css,o&&(r+="}"),n.media&&(r+="}"),n.supports&&(r+="}");var a=n.sourceMap;a&&"undefined"!=typeof btoa&&(r+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(a))))," */")),e.styleTagTransform(r,t,e.options)}(e,t,n)},remove:function(){!function(t){if(null===t.parentNode)return!1;t.parentNode.removeChild(t)}(e)}}}},589:function(t){"use strict";t.exports=function(t,e){if(e.styleSheet)e.styleSheet.cssText=t;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(t))}}},607:function(t,e,n){"use strict";var r=this&&this.__assign||function(){return r=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var o in e=arguments[n])Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t},r.apply(this,arguments)};Object.defineProperty(e,"__esModule",{value:!0});var o=n(907);function a(t,e){window.dispatchEvent(new CustomEvent(t,{detail:r(r({},e),{controller:this}),bubbles:!0}))}n(537);var i={1:"y",2:"x",3:"b",4:"a"},l={1:"a",2:"b"},c=function(){function t(t,e){var n=this;this.handleClick=function(t,e){n.vibrate&&navigator.vibrate(10),n.hooks[e]&&n.hooks[e](n),a.call(n,t)},this.attachEventHandlers=function(){n.refs.fullscreen.addEventListener("click",(function(){n.handleClick("gamecontroller:ancillary:fullscreen","fullscreen"),n.fullscreen=!n.fullscreen,n.fullscreen?n.openFullscreen():n.closeFullscreen()})),n.refs.select.addEventListener("click",(function(){n.handleClick("gamecontroller:ancillary:select","select")})),n.refs.start.addEventListener("click",(function(){n.handleClick("gamecontroller:ancillary:start","start")})),n.refs.up.addEventListener("click",(function(){n.handleClick("gamecontroller:dpad:up","up")})),n.refs.right.addEventListener("click",(function(){n.handleClick("gamecontroller:dpad:right","right")})),n.refs.down.addEventListener("click",(function(){n.handleClick("gamecontroller:dpad:down","down")})),n.refs.left.addEventListener("click",(function(){n.handleClick("gamecontroller:dpad:left","left")}));var t=2===n.actions?l:i;Object.keys(t).forEach((function(e,r){n.refs[t[e]+"Btn"].addEventListener("click",(function(){var t=2===n.actions?l[r+1]:i[r+1];n.hooks[t]&&n.hooks[t](n),n.vibrate&&navigator.vibrate(10),a.call(n,"gamecontroller:action:"+(2===n.actions?l[r+1]:i[r+1]))}))}))},this.closeFullscreen=function(){document.exitFullscreen()},this.openFullscreen=function(){n.document.requestFullscreen()},this.root=document.querySelector(t),this.actions=(null==e?void 0:e.actions)||2,this.refs={},this.hooks=e.hooks||{},this.vibrate=e.vibrate||!0,this.fullscreen=!1,this.document=document.documentElement}return t.prototype.render=function(){var t=this;this.root.appendChild(o.createElement.call(this.refs,{type:"div",attributes:[["classes",["gamecontroller__container"]]],children:[{type:"div",attributes:[["classes",["gamecontroller__stage"]]],ref:"stage"},{type:"div",attributes:[["classes",["gamecontroller__ancillaries"]]],children:[{type:"button",attributes:[["classes",["gamecontroller__ancillary-btn"]],["type","button"],["id","fullscreen"]],text:"fullscreen",ref:"fullscreen"},{type:"button",attributes:[["classes",["gamecontroller__ancillary-btn"]],["type","button"]],text:"select",ref:"select"},{type:"button",attributes:[["classes",["gamecontroller__ancillary-btn"]],["type","button"]],text:"start",ref:"start"}]},{type:"div",attributes:[["classes",["gamecontroller__main-controls"]]],children:[{type:"div",attributes:[["classes",["gamecontroller__d-pad-container"]]],children:[{type:"button",attributes:[["classes",["gamecontroller__d-pad-btn","gamecontroller__d-pad-btn--up"]]],ref:"up"},{type:"button",attributes:[["classes",["gamecontroller__d-pad-btn","gamecontroller__d-pad-btn--left"]]],ref:"left"},{type:"button",attributes:[["classes",["gamecontroller__d-pad-btn","gamecontroller__d-pad-btn--right"]]],ref:"right"},{type:"button",attributes:[["classes",["gamecontroller__d-pad-btn","gamecontroller__d-pad-btn--down"]]],ref:"down"}]},{type:"div",attributes:[["classes",["gamecontroller__actions",2===this.actions?"gamecontroller__actions--two":"gamecontroller__actions--four"]]],children:new Array(this.actions).fill("").map((function(e,n){return{type:"button",attributes:[["classes",["gamecontroller__action-btn","gamecontroller__action-btn--"+(n+1)]]],text:(2===t.actions?l[n+1]:i[n+1]).toUpperCase(),ref:(2===t.actions?l[n+1]:i[n+1])+"Btn"}}))}]}],ref:"container"})),this.attachEventHandlers()},t}();e.default=c}},e={};function n(r){var o=e[r];if(void 0!==o)return o.exports;var a=e[r]={id:r,exports:{}};return t[r].call(a.exports,a,a.exports,n),a.exports}return n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,{a:e}),e},n.d=function(t,e){for(var r in e)n.o(e,r)&&!n.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n(607)}()}));