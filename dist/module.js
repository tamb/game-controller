var $790a30309514fb1a$exports = {};
const $790a30309514fb1a$var$GameController = {
    init: function() {
        const buttons = document.querySelector(".game-controller__wrapper button");
        buttons.forEach((button)=>{
            button.addEventListener("click", ()=>{
                navigator.vibrate(100);
            });
        });
    }
};
document.addEventListener("DOMContentLoaded", ()=>{
    $790a30309514fb1a$var$GameController.init();
});


export {$790a30309514fb1a$exports as default};
//# sourceMappingURL=module.js.map
