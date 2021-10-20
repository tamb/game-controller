import GameController from "../dist/main.js"

var actions = 2;
function createController() {
  const controller = new GameController("#app", {
    actions,
    hooks: {
      X: function (self) {
        console.log("X hook", self);
      },
    },
  });
  const app = document.getElementById("app");
  app.innerHTML = "";
  controller.render();
  window.gamecontroller = controller;
  document
    .querySelector(".gamecontroller__stage")
    .addEventListener("click", function () {
      console.log("click");
      if (actions === 2) {
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