var GameController={init:function(){document.querySelectorAll(".game-controller__wrapper button").forEach((function(e){e.addEventListener("click",(function(){navigator.vibrate(10)}))}));var e=!1,t=document.documentElement;document.getElementById("fullscreen").addEventListener("click",(function(){(e=!e)?t.requestFullscreen?t.requestFullscreen():t.webkitRequestFullscreen?t.webkitRequestFullscreen():t.msRequestFullscreen&&t.msRequestFullscreen():document.exitFullscreen?document.exitFullscreen():document.webkitExitFullscreen?document.webkitExitFullscreen():document.msExitFullscreen&&document.msExitFullscreen()}))}};document.addEventListener("DOMContentLoaded",(function(){GameController.init()}));
//# sourceMappingURL=index.824f61c8.js.map