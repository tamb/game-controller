"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function _createClass(e,t,n){return t&&_defineProperties(e.prototype,t),n&&_defineProperties(e,n),e}function _toConsumableArray(e){return _arrayWithoutHoles(e)||_iterableToArray(e)||_unsupportedIterableToArray(e)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(e,t){if(e){if("string"==typeof e)return _arrayLikeToArray(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?_arrayLikeToArray(e,t):void 0}}function _iterableToArray(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}function _arrayWithoutHoles(e){if(Array.isArray(e))return _arrayLikeToArray(e)}function _arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function addVibrations(){document.querySelectorAll(".game-controller__Container button").forEach((function(e){e.addEventListener("click",(function(){navigator.vibrate(10)}))}))}function toggleFullscreen(){var e=!1,t=document.documentElement;document.getElementById("fullscreen").addEventListener("click",(function(){(e=!e)?t.requestFullscreen?t.requestFullscreen():t.webkitRequestFullscreen?t.webkitRequestFullscreen():t.msRequestFullscreen&&t.msRequestFullscreen():document.exitFullscreen?document.exitFullscreen():document.webkitExitFullscreen?document.webkitExitFullscreen():document.msExitFullscreen&&document.msExitFullscreen()}))}function createElement(e){var t,n=document.createElement(e.type);return null===(t=e.attributes)||void 0===t||t.forEach((function(e){var t;"classes"===e[0]?(t=n.classList).add.apply(t,_toConsumableArray(e[1])):n.setAttribute(e[0],e[1])})),n.textContent=e.text,n}var GameController=function(){function e(t,n){_classCallCheck(this,e),this.root=document.querySelector(t),this.actions=(null==n?void 0:n.actions)||2,this.refs={}}return _createClass(e,[{key:"createContainer",value:function(){this.refs.container=createElement({type:"div",attributes:[["classes",["game-controller__container"]]]})}},{key:"createStage",value:function(){this.refs.stage=createElement({type:"div",attributes:[["classes",["game-controller__stage"]]]})}},{key:"createAncillaries",value:function(){this.refs.ancillaries={container:createElement({type:"div",attributes:[["classes",["game-controller__ancillaries"]]]}),fullscreen:createElement({type:"button",attributes:[["classes",["game-controller__ancillary-btn"]],["type","button"],["id","fullscreen"]],text:"fullscreen"}),select:createElement({type:"button",attributes:[["classes",["game-controller__ancillary-btn"]],["type","button"]],text:"select"}),start:createElement({type:"button",attributes:[["classes",["game-controller__ancillary-btn"]],["type","button"]],text:"start"})}}},{key:"createMainControlsContainer",value:function(){this.refs.mainControls=createElement({type:"div",attributes:[["classes",["game-controller__main-controls"]]]})}},{key:"createDPad",value:function(){this.refs.dpad={container:createElement({type:"div",attributes:[["classes",["game-controller__d-pad-container"]]]}),up:createElement({type:"button",attributes:[["classes",["game-controller__d-pad-btn","game-controller__d-pad-btn--up"]]]}),right:createElement({type:"button",attributes:[["classes",["game-controller__d-pad-btn","game-controller__d-pad-btn--right"]]]}),down:createElement({type:"button",attributes:[["classes",["game-controller__d-pad-btn","game-controller__d-pad-btn--down"]]]}),left:createElement({type:"button",attributes:[["classes",["game-controller__d-pad-btn","game-controller__d-pad-btn--left"]]]})},this.refs.dpad.container.appendChild(this.refs.dpad.up),this.refs.dpad.container.appendChild(this.refs.dpad.left),this.refs.dpad.container.appendChild(this.refs.dpad.right),this.refs.dpad.container.appendChild(this.refs.dpad.down),this.refs.mainControls.appendChild(this.refs.dpad.container)}},{key:"createActions",value:function(){var e=this;this.refs.actions.buttons=new Array(this.actions).fill().map((function(e,t){return createElement({type:"button",attributes:[["classes",["game-controller__action-btn","game-controller__action-btn--".concat(t+1)]]]})})),this.refs.actions.buttons.forEach((function(t){e.refs.actions.actionsContainer.appendChild(t)}))}},{key:"createActionsContainer",value:function(){this.refs.actions={},this.refs.actions.actionsContainer=createElement({type:"div",attributes:[["classes",["game-controller__actions","".concat(2===this.actions?"game-controller__actions--two":"game-controller__actions--four")]]]})}},{key:"createAllElements",value:function(){this.createContainer(),this.createStage(),this.createAncillaries(),this.createMainControlsContainer(),this.createDPad(),this.createActionsContainer(),this.createActions()}},{key:"insertAllElements",value:function(){this.refs.container.appendChild(this.refs.stage),this.refs.ancillaries.container.appendChild(this.refs.ancillaries.fullscreen),this.refs.ancillaries.container.appendChild(this.refs.ancillaries.select),this.refs.ancillaries.container.appendChild(this.refs.ancillaries.start),this.refs.container.appendChild(this.refs.ancillaries.container),this.refs.container.appendChild(this.refs.mainControls),this.refs.mainControls.appendChild(this.refs.actions.actionsContainer)}},{key:"render",value:function(){this.createAllElements(),this.insertAllElements(),this.root.appendChild(this.refs.container)}}]),e}(),actions=2;function createController(){var e=new GameController("#app",{actions:actions});document.getElementById("app").innerHTML="",e.render(),addVibrations(),document.getElementById("fullscreen").addEventListener("click",toggleFullscreen),document.querySelector(".game-controller__stage").addEventListener("click",(function(){console.log("click"),actions=2==actions?4:2,createController()}))}document.addEventListener("DOMContentLoaded",(function(){createController()}));
//# sourceMappingURL=index.5269ebb7.js.map
