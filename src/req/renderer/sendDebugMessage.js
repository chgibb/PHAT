const ipc = require("electron").ipcRenderer;
var channel = "";
module.exports.initialize(channel)
{
    channel = channel;
}
module.exports.send(obj)
{
    ipc.send('debug',{channel : channel, obj : obj});
}