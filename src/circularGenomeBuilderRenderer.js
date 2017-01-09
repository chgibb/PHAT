const ipc = require('electron').ipcRenderer;
var viewMgr = require('./req/renderer/viewMgr');

require("./req/renderer/commonBehaviour");

window.$ = window.jQuery = require('./req/renderer/jquery-2.2.4.js');

$
(
    function()
    {
        ipc.send('keySub',{action : "keySub", channel : "input", key : "fastqInputs", replyChannel : "circularGenomeBuilder"});
        ipc.send('input',{replyChannel : 'circularGenomeBuilder', action : 'getState', key : 'fastqInputs'});

        viewMgr.render();
    }
);