function addVibrations() {
  const buttons = document.querySelectorAll(".game-controller__wrapper button");
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

class GameController {
  constructor(config) {
    this.actions = config?.actions || 2;
    this.refs = {};
  }

  renderActions() {
    if (this.actions === 2) {
      return `
      <div class="game-controller__actions">
        <button class="game-controller__action-btn game-controller__action-btn--1" type="button">B</button>
        <button class="game-controller__action-btn game-controller__action-btn--2" type="button">A</button>
      </div>
          `;
    } else if (this.actions === 4) {
      return `
      <div class="game-controller__actions game-controller__actions--quad">
        <button class="game-controller__action-btn game-controller__action-btn--1" type="button">Y</button>
        <button class="game-controller__action-btn game-controller__action-btn--2" type="button">X</button>
        <button class="game-controller__action-btn game-controller__action-btn--3" type="button">B</button>
        <button class="game-controller__action-btn game-controller__action-btn--4" type="button">A</button>
      </div>
      `;
    }
  }
  render() {
    return `<div class="game-controller__wrapper">
      <div class="game-controller__stage"></div>
      <div class="game-controller__ancillaries">
        <button type="button" id="fullscreen">fullscreen</buttontype>
        <button type="button">Select</button>
        <button type="button">Start</button>
      </div>
      <div class="game-controller__main-controls">
        <div class="game-controller__d-pad-container">
          <button
            type="button"
            class="
              game-controller__d-pad-button game-controller__d-pad-button--up
            "
          ></button>
          <button
            type="button"
            class="
              game-controller__d-pad-button game-controller__d-pad-button--left
            "
          ></button>
          <button
            type="button"
            class="
              game-controller__d-pad-button game-controller__d-pad-button--right
            "
          ></button>
          <button
            type="button"
            class="
              game-controller__d-pad-button game-controller__d-pad-button--down
            "
          ></button>
        </div>
        ${this.renderActions()}
      </div>
    </div>`;
  }
}

var actions = 2;
function createController() {
  const controller = new GameController({ actions });
  const app = document.getElementById("app");
  app.innerHTML = "";
  app.insertAdjacentHTML("afterbegin", controller.render());
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
