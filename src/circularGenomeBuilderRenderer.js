const ipc = require('electron').ipcRenderer;
var viewMgr = require('./req/renderer/viewMgr');
var addMasterView = require("./req/renderer/circularGenomeBuilderRenderer/masterView");
let CircularGenomeMgr = require("./req/renderer/circularGenomeMgr");


require("./req/renderer/commonBehaviour");

window.$ = window.jQuery = require('jquery');
let circularGenomeMgr = new CircularGenomeMgr.Mgr
(
    'circularGenomeBuilder',
    {
        postStateHandle : function(channel,arg)
        {
            ipc.send(channel,arg);
        },
        spawnHandle : function(channel,arg)
        {
            ipc.send(channel,arg);
        },
        fsAccess : function(str)
        {
            return str;
        }
    }
);
$
(
    function()
    {
        addMasterView.addView(viewMgr.views,"view",circularGenomeMgr);
        viewMgr.changeView("masterView");
        viewMgr.render();
        ipc.send('keySub',{action : "keySub", channel : "input", key : "fastaInputs", replyChannel : "circularGenomeBuilder"});
        ipc.send('input',{replyChannel : 'circularGenomeBuilder', action : 'getState', key : 'fastaInputs'});
        ipc.send('keySub',{action : "keySub", channel : "circularGenomeBuilder", key : "managedFastas", replyChannel : "circularGenomeBuilder"});
        ipc.send("circularGenomeBuilder",{replyChannel : "circularGenomeBuilder", replyChannel : "getState", key : "managedFastas"});
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
                            viewMgr.getViewByName("masterView").fastaInputs = arg.val;
                            viewMgr.getViewByName("masterView").dataChanged();
                        }
                    }
                    if(arg.key == "managedFastas")
                    {
                        if(arg.val != 0)
                        {
                            circularGenomeMgr.managedFastas = arg.val;
                            viewMgr.getViewByName("masterView").dataChanged();
                        }
                    }
                }
                viewMgr.render();
            }
        );
    }
);