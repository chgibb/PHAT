const ipc = require('electron').ipcRenderer;
var viewMgr = require('./req/renderer/viewMgr');
var addMasterView = require("./req/renderer/circularGenomeBuilderRenderer/masterView");

require("./req/renderer/commonBehaviour");

require('./angularplasmid.complete.min.js');

window.$ = window.jQuery = require('jquery');

$
(
    function()
    {
        addMasterView.addView(viewMgr.views,"view");
        viewMgr.changeView("masterView");
        viewMgr.render();
        ipc.send('keySub',{action : "keySub", channel : "input", key : "fastaInputs", replyChannel : "circularGenomeBuilder"});
        ipc.send('input',{replyChannel : 'circularGenomeBuilder', action : 'getState', key : 'fastaInputs'});

        ipc.on
        (
            'circularGenomeBuilder',function(event,arg)
            {
                if(arg.action == "getState" || arg.action == "keyChange")
                {
                    if(arg.key == "fastaInputs")
                    {
                        if(arg.val != 0)
                        {
                            viewMgr.getIndexOfViewByName("masterView").fastaInputs = arg;
                        }
                    }
                }
            }
        );
    }
);