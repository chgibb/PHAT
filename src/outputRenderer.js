const ipc = require("electron").ipcRenderer;
window.$ = window.jQuery = require('jquery');
            
var id = require("./req/renderer/MakeValidID");
var viewMgr = require("./req/renderer/viewMgr");
require("./req/renderer/commonBehaviour");


var addMasterView = require("./req/renderer/OutputRenderer/masterView");
$
(
    function()
    {
        addMasterView.addView(viewMgr.views,"view");
        viewMgr.changeView("masterReportView");


        viewMgr.render();
        ipc.on
        (
            "output",function(event,arg)
            {
                if(arg.action === "getState" || arg.action === "keyChange")
                {
                    if(arg.key == "fastqInputs" && arg.val != 0)
                        viewMgr.getViewByName("report",viewMgr.getViewByName("masterReportView").views).fastqInputs = arg.val;
                    if(arg.key == "QCData" && arg.val != 0)
                        viewMgr.getViewByName("report",viewMgr.getViewByName("masterReportView").views).QC.QCData = arg.val;
                }
                viewMgr.render();
            }
        );
        ipc.send('keySub',{action : "keySub", channel : "input", key : "fastqInputs", replyChannel : "output"});
        ipc.send('keySub',{action : "keySub", channel : "QC", key : "QCData", replyChannel : "output"});
        ipc.send('input',{replyChannel : 'output', action : 'getState', key : 'fastqInputs'});
        ipc.send('QC',{replyChannel : 'output', action : 'getState', key : 'QCData'});
    }
);