let remote = require("electron").remote;
document.addEventListener
(
    "keydown",function(key)
    {
        //F12
        if(key.which === 123)
        {
            remote.getCurrentWindow().toggleDevTools();
        }
    }
);

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