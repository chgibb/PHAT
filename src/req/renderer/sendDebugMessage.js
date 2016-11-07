const ipc = require("electron").ipcRenderer;
var channel = "";
module.exports.initialize = function(channel)
{
    channel = channel;
}
module.exports.send = function(obj)
{
    ipc.send('debug',{channel : channel, obj : obj});
}