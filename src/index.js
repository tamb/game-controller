const GameController = {
  init: function () {
    const buttons = document.querySelector(".game-controller__wrapper button");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        navigator.vibrate(100);
      });
    });
  },
};

document.addEventListener("DOMContentLoaded", () => {
  GameController.init();
});
