import GameController from "./index";

var actions = 2;
function createController() {
  const controller = new GameController("#app", {
    actions,
    hooks: {
      X: function (self) {
        console.log("X hook", self);
      },
      A: function (self) {
        console.log("A HOOK ", self);
      },
    },
  });
  console.log(controller);
  const app = document.getElementById("app");
  app.innerHTML = "";
  controller.render();
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
