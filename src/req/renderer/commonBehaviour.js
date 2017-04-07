/**
 * Attaches event handlers to the window and document objects.
 * Report a runtime error in an alert box and open the dev tools, and disables dragging and dropping of foreign content into the window.
 * @module req/renderer/commonBehaviour
 */
let remote = require("electron").remote;

/*
 Adapted from answer by Fizer Khan
 http://stackoverflow.com/questions/205688/javascript-exception-handling
 and
 user1398498
 http://stackoverflow.com/questions/2604976/javascript-how-to-display-script-errors-in-a-popup-alert
*/
window.onerror = function(message,file,line,col,error)
{
    if(message)
    {
        alert("Error:\n\t" + message + "\nLine:\n\t" + line + "\nFile:\n\t" + file);
    }
    remote.getCurrentWindow().openDevTools();
}

/*
 Adapted from answer by zcbenz
 https://github.com/electron/electron/issues/908
*/
document.addEventListener
(
    'drop',function(e)
    {
        e.preventDefault();
        e.stopPropagation();
    }
);
document.addEventListener
(
    'dragover',function(e)
    {
        e.preventDefault();
        e.stopPropagation();
    }
);