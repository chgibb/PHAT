const ipc = require('electron').ipcRenderer;

var id = require("./req/renderer/MakeValidID");
var viewMgr = require('./req/renderer/viewMgr');
var QCClass = require('./req/renderer/QC');

var views = new Array();

var addSummaryView = require('./req/renderer/QCRenderer/summaryView');
var addReportView = require('./req/renderer/QCRenderer/reportView');

var QC = new QCClass
(
    'QC',
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
window.$ = window.jQuery = require('./req/renderer/jquery-2.2.4.js');

$
(
    function()
    {
        addSummaryView(views,'reports',QC);
        addReportView(views,'reports',QC);


        viewMgr.changeView("summary");

        ipc.send('keySub',{action : "keySub", channel : "input", key : "fastqInputs", replyChannel : "QC"});
		ipc.send('keySub',{action : "keySub", channel : "input", key : "fastqInputs", replyChannel : "QC"});
		ipc.send('keySub',{action : "keySub", channel : "QC", key : "QCData", replyChannel : "QC"});
	
		
		ipc.send('QC',{replyChannel : 'QC', action : 'getState', key : 'QCData'});
		ipc.send('input',{replyChannel : 'QC', action : 'getState', key : 'fastqInputs'});

        ipc.on
        (
            'QC',function(event,arg)
            {
                if(arg.action == "getState" || arg.action == "keyChange")
                {
                    if(arg.key == "fastqInputs")
                    {
                        if(arg.val != 0)
                        {
                            for(var i in arg.val)
                            {
                                QC.addQCData(arg.val[i].name)
                            }
                            //views[view.getIndexOfViewByName(views,'summary')].data.QCData = QC.QCData;
                            //views[view.getIndexOfViewByName(views,'summary')].data.fastqInputs = arg.val;
                            viewMgr.getViewByName("summary").data.fastqInputs = arg.val;
                            render();
                        }
                    }
                    if(arg.key == 'QCData')
                    {
                        if(arg.val != 0 )
                        {
                            QC.QCData = arg.val;
                            //views[view.getIndexOfViewByName(views,'summary')].data.QCData = QC.QCData;
                        }
                    }
                }
                render();
            }
        );
        ipc.on
        (
            "spawnReply",function(event,arg)
            {
                if(arg.processName == QC.fastQC)
                {
                    if(!arg.done)
                    {
                        if(arg.unBufferedData)
                        {
                            if(arg.unBufferedData.match(new RegExp("[0-9]|[.]","g")))
						        $('#'+id.makeValidID(arg.args[0])).text(arg.unBufferedData);
                        }
                    }
                }
                QC.spawnReply(event,arg);
            }
        );
        render();
    }
);
function changeView(newView)
{
    views[view.getIndexOfViewByName(views,currView)].unMount();
    currView = newView;
    views[view.getIndexOfViewByName(views,currView)].mount();
    render();
}