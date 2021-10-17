const GameController = {
  init: function () {
    const buttons = document.querySelectorAll(
      ".game-controller__wrapper button"
    );
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        navigator.vibrate(10);
      });
    });

    var fullscreen = false;

    var elem = document.documentElement;

    document
      .getElementById("fullscreen")
      .addEventListener("click", function () {
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
  },
};

document.addEventListener("DOMContentLoaded", () => {
  GameController.init();
});
