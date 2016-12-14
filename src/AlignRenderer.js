const ipc = require('electron').ipcRenderer;
window.$ = window.jQuery = require('./req/renderer/jquery-2.2.4.js');
var id = require("./req/renderer/MakeValidID.js");
var fs = require('fs');
var viewMgr = require('./req/renderer/viewMgr');
var addReportView = require('./req/renderer/AlignRenderer/reportView');
require("./req/renderer/commonKeys");

var views = new Array();

var currView = "report";

var Align = require('./req/renderer/Align');
var align = new Align
(
    'align',
    {
        postStateHandle : function(channel,arg)
        {
            ipc.send(channel,arg);
            viewMgr.render();
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

function render()
{
    views[view.getIndexOfViewByName(views,currView)].render();
}

$
(
    function()
    {
        addReportView(viewMgr.views,"container",align);

        viewMgr.changeView("report");
        
        ipc.send('align',{replyChannel : 'align', action : 'getState', key : 'aligns'});
        ipc.send('input',{replyChannel : 'align', action : 'getState', key : 'fastaInputs'});
		ipc.send('input',{replyChannel : 'align', action : 'getState', key : 'fastqInputs'});

        ipc.send('keySub',{action : "keySub",channel : "input", key : "fastqInputs", replyChannel : "align"});
		ipc.send('keySub',{action : "keySub",channel : "input", key : "fastaInputs", replyChannel : "align"});

        ipc.on
        (
            'align',function(event,arg)
            {
                if(arg.action == "getState" || arg.action == "keyChange")
                {
                    if(arg.key == "fastqInputs")
                    {
                        if(arg.val != 0)
                        {
                            //views[view.getIndexOfViewByName(views,"report")].data.fastqInputs = arg.val;
                            viewMgr.getViewByName("report").data.fastqInputs = arg.val;
                        }
                    }
                    if(arg.key == "fastaInputs")
                    {
                        if(arg.val != 0)
                        {
                            //views[view.getIndexOfViewByName(views,"report")].data.fastaInputs = arg.val;
                            viewMgr.getViewByName("report").data.fastaInputs = arg.val;
                        }
                    }
                }
                
                viewMgr.render();
            }
        );
        ipc.on
        (
            "spawnReply",function(event,arg)
            {
                //update from spawned process.
                //forward to handler.
                align.spawnReply(event,arg);
            }
        );
    }
);
$(window).resize
(
	function()
	{
        viewMgr.render();
    }
);