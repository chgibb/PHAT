const ipc = require('electron').ipcRenderer;
var viewMgr = require('./req/renderer/viewMgr');
var addMasterView = require("./circularGenomeBuilderRenderer/masterView");

require("./req/renderer/commonBehaviour");

require('./angularplasmid.complete.min.js');

window.$ = window.jQuery = require('./req/renderer/jquery-2.2.4.js');

$
(
    function()
    {
        addMasterView.addView(viewMgr.views,"view");
        viewMgr.render();
        ipc.send('keySub',{action : "keySub", channel : "input", key : "fastqInputs", replyChannel : "circularGenomeBuilder"});
        ipc.send('input',{replyChannel : 'circularGenomeBuilder', action : 'getState', key : 'fastqInputs'});
    }
);