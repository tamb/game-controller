var $3ff7b848f6d35d30$var$GameController = {
    init: function init() {
        var buttons = document.querySelector(".game-controller__wrapper button");
        buttons.forEach(function(button) {
            button.addEventListener("click", function() {
                navigator.vibrate(100);
            });
        });
    }
};
document.addEventListener("DOMContentLoaded", function() {
    $3ff7b848f6d35d30$var$GameController.init();
});


//# sourceMappingURL=main.js.map
