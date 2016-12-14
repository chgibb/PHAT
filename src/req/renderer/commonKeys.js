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