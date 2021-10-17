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
function addVibrations() {
    var buttons = document.querySelectorAll(".game-controller__wrapper button");
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
}
var GameController = /*#__PURE__*/ function() {
    function GameController(config) {
        _classCallCheck(this, GameController);
        this.actions = (config === null || config === void 0 ? void 0 : config.actions) || 2;
        this.refs = {
        };
    }
    _createClass(GameController, [
        {
            key: "renderActions",
            value: function renderActions() {
                if (this.actions === 2) return "\n      <div class=\"game-controller__actions\">\n        <button class=\"game-controller__action-btn game-controller__action-btn--1\" type=\"button\">B</button>\n        <button class=\"game-controller__action-btn game-controller__action-btn--2\" type=\"button\">A</button>\n      </div>\n          ";
                else if (this.actions === 4) return "\n      <div class=\"game-controller__actions game-controller__actions--quad\">\n        <button class=\"game-controller__action-btn game-controller__action-btn--1\" type=\"button\">Y</button>\n        <button class=\"game-controller__action-btn game-controller__action-btn--2\" type=\"button\">X</button>\n        <button class=\"game-controller__action-btn game-controller__action-btn--3\" type=\"button\">B</button>\n        <button class=\"game-controller__action-btn game-controller__action-btn--4\" type=\"button\">A</button>\n      </div>\n      ";
            }
        },
        {
            key: "render",
            value: function render() {
                return "<div class=\"game-controller__wrapper\">\n      <div class=\"game-controller__stage\"></div>\n      <div class=\"game-controller__ancillaries\">\n        <button type=\"button\" id=\"fullscreen\">fullscreen</buttontype>\n        <button type=\"button\">Select</button>\n        <button type=\"button\">Start</button>\n      </div>\n      <div class=\"game-controller__main-controls\">\n        <div class=\"game-controller__d-pad-container\">\n          <button\n            type=\"button\"\n            class=\"\n              game-controller__d-pad-button game-controller__d-pad-button--up\n            \"\n          ></button>\n          <button\n            type=\"button\"\n            class=\"\n              game-controller__d-pad-button game-controller__d-pad-button--left\n            \"\n          ></button>\n          <button\n            type=\"button\"\n            class=\"\n              game-controller__d-pad-button game-controller__d-pad-button--right\n            \"\n          ></button>\n          <button\n            type=\"button\"\n            class=\"\n              game-controller__d-pad-button game-controller__d-pad-button--down\n            \"\n          ></button>\n        </div>\n        ".concat(this.renderActions(), "\n      </div>\n    </div>");
            }
        }
    ]);
    return GameController;
}();
document.addEventListener("DOMContentLoaded", function() {
    var controller = new GameController({
        actions: 4
    });
    var app = document.getElementById("app");
    app.insertAdjacentHTML("afterbegin", controller.render());
    document.getElementById("fullscreen").addEventListener("click", toggleFullscreen);
});

//# sourceMappingURL=index.017db2f2.js.map
